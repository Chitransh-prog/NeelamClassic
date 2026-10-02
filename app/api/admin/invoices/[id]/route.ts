import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await withDbRetry(async () => {
      return await prisma.invoice.findUnique({
        where: { id },
        include: {
          customer: true,
          items: { orderBy: { sortOrder: "asc" } },
          payments: { orderBy: { paymentDate: "desc" } },
        },
      });
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Also get current salon settings for PDF rendering
    const settings = await withDbRetry(async () => {
      return await prisma.setting.findMany();
    });
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ invoice, settings: settingsMap });
  } catch (err: unknown) {
    console.error("Get invoice details error:", err);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, paymentAmount, paymentMode, paymentRef, status } = body;

    const updated = await withDbRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        const inv = await tx.invoice.findUnique({ where: { id } });
        if (!inv) throw new Error("Invoice not found");

        if (action === "add_payment") {
          const pAmount = parseFloat(paymentAmount || "0");
          if (pAmount <= 0) throw new Error("Payment amount must be greater than 0");

          await tx.payment.create({
            data: {
              invoiceId: id,
              amount: pAmount,
              paymentMode: paymentMode || "Cash",
              reference: paymentRef || null,
            },
          });

          const newAdvance = Number(inv.advancePaid) + pAmount;
          const newBalance = Math.max(0, Number(inv.total) - newAdvance);
          const newStatus = newBalance <= 0 ? "Paid" : "Partially paid";

          return await tx.invoice.update({
            where: { id },
            data: {
              advancePaid: newAdvance,
              balanceDue: newBalance,
              status: newStatus,
            },
            include: { customer: true, items: true, payments: true },
          });
        }

        if (action === "mark_paid") {
          const balance = Number(inv.balanceDue);
          if (balance > 0) {
            await tx.payment.create({
              data: {
                invoiceId: id,
                amount: balance,
                paymentMode: paymentMode || "Cash",
                reference: "Balance cleared",
              },
            });
          }

          return await tx.invoice.update({
            where: { id },
            data: {
              advancePaid: inv.total,
              balanceDue: 0,
              status: "Paid",
            },
            include: { customer: true, items: true, payments: true },
          });
        }

        if (status) {
          return await tx.invoice.update({
            where: { id },
            data: { status },
            include: { customer: true, items: true, payments: true },
          });
        }

        return inv;
      });
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (err: unknown) {
    console.error("Update invoice error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete as requested in spec
    await withDbRetry(async () => {
      await prisma.invoice.update({
        where: { id },
        data: { isSoftDeleted: true },
      });
    });

    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (err: unknown) {
    console.error("Delete invoice error:", err);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
