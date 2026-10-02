import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { altText: { contains: query, mode: "insensitive" } },
      ];
    }

    const assets = await withDbRetry(async () => {
      return await prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    });

    return NextResponse.json({ assets });
  } catch (err: unknown) {
    console.error("Fetch media assets error:", err);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
    }

    await withDbRetry(async () => {
      await prisma.mediaAsset.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Asset deleted" });
  } catch (err: unknown) {
    console.error("Delete media error:", err);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
