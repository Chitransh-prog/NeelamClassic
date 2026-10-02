import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await withDbRetry(async () => {
      return await prisma.testimonial.findMany({
        orderBy: { sortOrder: "asc" },
      });
    });
    return NextResponse.json({ testimonials });
  } catch (err: unknown) {
    console.error("Get testimonials error:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, text, stars, isVerified, avatar } = body;

    const testimonial = await withDbRetry(async () => {
      return await prisma.testimonial.create({
        data: {
          name,
          text,
          stars: stars ? parseInt(stars, 10) : 5,
          isVerified: isVerified !== undefined ? Boolean(isVerified) : true,
          avatar,
        },
      });
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (err: unknown) {
    console.error("Create testimonial error:", err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, text, stars, isVerified, isHidden, avatar } = body;

    const updated = await withDbRetry(async () => {
      return await prisma.testimonial.update({
        where: { id },
        data: {
          name,
          text,
          stars: stars ? parseInt(stars, 10) : undefined,
          isVerified,
          isHidden,
          avatar,
        },
      });
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err: unknown) {
    console.error("Update testimonial error:", err);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await withDbRetry(async () => {
      await prisma.testimonial.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (err: unknown) {
    console.error("Delete review error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
