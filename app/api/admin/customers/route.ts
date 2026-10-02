import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { phone: { contains: query } },
        { email: { contains: query, mode: "insensitive" } },
      ];
    }

    const customers = await withDbRetry(async () => {
      return await prisma.customer.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        include: {
          invoices: {
            where: { isSoftDeleted: false },
            select: { id: true, invoiceNumber: true, total: true, status: true, createdAt: true },
          },
        },
      });
    });

    return NextResponse.json({ customers });
  } catch (err: unknown) {
    console.error("Get customers error:", err);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, phone, email, notes } = await request.json();
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    const customer = await withDbRetry(async () => {
      return await prisma.customer.upsert({
        where: { phone: cleanPhone },
        update: {
          name,
          email: email || undefined,
          notes: notes || undefined,
        },
        create: {
          name,
          phone: cleanPhone,
          email: email || null,
          notes: notes || null,
        },
      });
    });

    return NextResponse.json({ success: true, customer });
  } catch (err: unknown) {
    console.error("Create customer error:", err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
