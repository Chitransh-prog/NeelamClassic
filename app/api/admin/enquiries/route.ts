import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (status && status !== "All") {
      where.status = status;
    }
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { phone: { contains: query } },
        { service: { contains: query, mode: "insensitive" } },
      ];
    }

    const enquiries = await withDbRetry(async () => {
      return await prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    });

    return NextResponse.json({ enquiries });
  } catch (err: unknown) {
    console.error("Get enquiries error:", err);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await withDbRetry(async () => {
      return await prisma.enquiry.update({
        where: { id },
        data: {
          status: status || undefined,
          notes: notes !== undefined ? notes : undefined,
        },
      });
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (err: unknown) {
    console.error("Update enquiry error:", err);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await withDbRetry(async () => {
      await prisma.enquiry.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (err: unknown) {
    console.error("Delete enquiry error:", err);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
