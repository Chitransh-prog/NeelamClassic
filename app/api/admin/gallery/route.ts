import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (category && category !== "All") {
      where.category = category;
    }

    const items = await withDbRetry(async () => {
      return await prisma.galleryItem.findMany({
        where,
        orderBy: { sortOrder: "asc" },
      });
    });

    return NextResponse.json({ items });
  } catch (err: unknown) {
    console.error("Get gallery error:", err);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, mediaType, url, altText, isFeatured } = body;

    const item = await withDbRetry(async () => {
      return await prisma.galleryItem.create({
        data: {
          title,
          category,
          mediaType: mediaType || "image",
          url,
          altText,
          isFeatured: Boolean(isFeatured),
        },
      });
    });

    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    console.error("Create gallery item error:", err);
    return NextResponse.json({ error: "Failed to add to gallery" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await withDbRetry(async () => {
      await prisma.galleryItem.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch (err: unknown) {
    console.error("Delete gallery item error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
