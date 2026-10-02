import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await withDbRetry(async () => {
      return await prisma.serviceCategory.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });
    });

    return NextResponse.json({ categories });
  } catch (err: unknown) {
    console.error("Get services error:", err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "category") {
      const { name, slug, description, thumbnail } = body;
      const category = await withDbRetry(async () => {
        return await prisma.serviceCategory.create({
          data: {
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description,
            thumbnail,
          },
        });
      });
      return NextResponse.json({ success: true, category });
    }

    if (type === "item") {
      const { categoryId, name, description, price, priceDisplay, badge, tab } = body;
      const numPrice = price ? parseFloat(price) : null;

      const item = await withDbRetry(async () => {
        return await prisma.serviceItem.create({
          data: {
            categoryId,
            name,
            description,
            price: numPrice,
            priceDisplay: priceDisplay || (numPrice ? `₹${numPrice}` : ""),
            badge,
            tab,
          },
        });
      });
      return NextResponse.json({ success: true, item });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Create service error:", err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, type, ...data } = body;

    if (type === "item") {
      const numPrice = data.price !== undefined ? (data.price ? parseFloat(data.price) : null) : undefined;
      const updated = await withDbRetry(async () => {
        return await prisma.serviceItem.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            price: numPrice,
            priceDisplay: data.priceDisplay,
            badge: data.badge,
            tab: data.tab,
            isActive: data.isActive,
          },
        });
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === "category") {
      const updated = await withDbRetry(async () => {
        return await prisma.serviceCategory.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            thumbnail: data.thumbnail,
          },
        });
      });
      return NextResponse.json({ success: true, category: updated });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Update service error:", err);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (type === "category") {
      await withDbRetry(async () => {
        await prisma.serviceCategory.delete({ where: { id } });
      });
    } else {
      await withDbRetry(async () => {
        await prisma.serviceItem.delete({ where: { id } });
      });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err: unknown) {
    console.error("Delete service error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
