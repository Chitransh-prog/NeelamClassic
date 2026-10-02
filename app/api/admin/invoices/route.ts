import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      isSoftDeleted: false,
    };

    if (status && status !== "All") {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { invoiceNumber: { contains: query, mode: "insensitive" } },
        { customer: { name: { contains: query, mode: "insensitive" } } },
        { customer: { phone: { contains: query } } },
      ];
    }

    const invoices = await withDbRetry(async () => {
      return await prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          items: { orderBy: { sortOrder: "asc" } },
          payments: { orderBy: { paymentDate: "desc" } },
        },
      });
    });

    // Compute summary totals
    let totalRevenue = 0;
    let totalPending = 0;
    for (const inv of invoices) {
      totalRevenue += Number(inv.total);
      totalPending += Number(inv.balanceDue);
    }

    return NextResponse.json({
      invoices,
      summary: {
        count: invoices.length,
        totalRevenue,
        totalPending,
      },
    });
  } catch (err: unknown) {
    console.error("Get invoices error:", err);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      eventDate,
      notes,
      items,
      discountType,
      discountValue,
      taxRate,
      advancePaid,
      paymentMode,
      status,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and phone are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one service line item is required" },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone.replace(/[^0-9+]/g, "");

    // Financial year computation (April 1 to March 31)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed, 3 is April
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const endYear = (startYear + 1).toString().slice(-2);
    const financialYear = `${startYear}-${endYear}`;

    // Gap-safe transactional invoice creation
    const createdInvoice = await withDbRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        // 1. Upsert customer
        const customer = await tx.customer.upsert({
          where: { phone: cleanPhone },
          update: {
            name: customerName,
            email: customerEmail || undefined,
          },
          create: {
            name: customerName,
            phone: cleanPhone,
            email: customerEmail || null,
          },
        });

        // 2. Determine sequence number
        const prefixSetting = await tx.setting.findUnique({
          where: { key: "invoice_prefix" },
        });
        const prefix = prefixSetting?.value || "NCS";

        const highest = await tx.invoice.findFirst({
          where: { financialYear },
          orderBy: { sequenceNumber: "desc" },
        });

        const nextSequence = (highest?.sequenceNumber || 0) + 1;
        const seqStr = nextSequence.toString().padStart(4, "0");
        const invoiceNumber = `${prefix}-${startYear}-${seqStr}`;

        // 3. Compute item totals & invoice totals
        let subtotal = 0;
        interface ComputedItem {
          description: string;
          quantity: number;
          rate: number;
          discount: number;
          amount: number;
          sortOrder: number;
        }

        const computedItems: ComputedItem[] = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const qty = parseInt(item.quantity || "1", 10);
          const rate = parseFloat(item.rate || "0");
          const disc = parseFloat(item.discount || "0");
          const amount = Math.max(0, qty * rate - disc);
          subtotal += amount;

          computedItems.push({
            description: item.description,
            quantity: qty,
            rate,
            discount: disc,
            amount,
            sortOrder: i,
          });
        }

        // Apply invoice-level discount
        const discVal = parseFloat(discountValue || "0");
        let discAmount = 0;
        if (discountType === "percent") {
          discAmount = (subtotal * discVal) / 100;
        } else {
          discAmount = discVal;
        }
        const discountedSubtotal = Math.max(0, subtotal - discAmount);

        // Apply tax if applicable
        const taxRateNum = parseFloat(taxRate || "0");
        const taxAmount = (discountedSubtotal * taxRateNum) / 100;
        const total = discountedSubtotal + taxAmount;

        const advanceNum = parseFloat(advancePaid || "0");
        const balanceDue = Math.max(0, total - advanceNum);

        let finalStatus = status || "Unpaid";
        if (balanceDue <= 0 && total > 0) {
          finalStatus = "Paid";
        } else if (advanceNum > 0 && balanceDue > 0) {
          finalStatus = "Partially paid";
        }

        // 4. Create Invoice record
        const invoice = await tx.invoice.create({
          data: {
            invoiceNumber,
            financialYear,
            sequenceNumber: nextSequence,
            customerId: customer.id,
            eventDate: eventDate ? new Date(eventDate) : null,
            notes,
            subtotal,
            discountType: discountType || "flat",
            discountValue: discVal,
            discountAmount: discAmount,
            taxRate: taxRateNum,
            taxAmount,
            total,
            advancePaid: advanceNum,
            balanceDue,
            status: finalStatus,
            paymentMode: paymentMode || "Cash",
            items: {
              create: computedItems.map((ci) => ({
                description: ci.description,
                quantity: ci.quantity,
                rate: ci.rate,
                discount: ci.discount,
                amount: ci.amount,
                sortOrder: ci.sortOrder,
              })),
            },
          },
          include: {
            customer: true,
            items: true,
          },
        });

        // 5. If advance paid > 0, log payment record
        if (advanceNum > 0) {
          await tx.payment.create({
            data: {
              invoiceId: invoice.id,
              amount: advanceNum,
              paymentMode: paymentMode || "Cash",
              reference: "Initial Payment / Advance",
            },
          });
        }

        return invoice;
      });
    });

    return NextResponse.json({ success: true, invoice: createdInvoice });
  } catch (err: unknown) {
    console.error("Create invoice error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create invoice" },
      { status: 500 }
    );
  }
}
