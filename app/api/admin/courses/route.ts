import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await withDbRetry(async () => {
      return await prisma.course.findMany({
        orderBy: { sortOrder: "asc" },
      });
    });
    return NextResponse.json({ courses });
  } catch (err: unknown) {
    console.error("Get courses error:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, duration, description, modules, hasCertificate, image, price } = body;

    const course = await withDbRetry(async () => {
      return await prisma.course.create({
        data: {
          title,
          duration,
          description,
          modules: modules || [],
          hasCertificate: hasCertificate !== undefined ? Boolean(hasCertificate) : true,
          image,
          price: price ? parseFloat(price) : null,
        },
      });
    });

    return NextResponse.json({ success: true, course });
  } catch (err: unknown) {
    console.error("Create course error:", err);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, duration, description, modules, hasCertificate, image, price } = body;

    const updated = await withDbRetry(async () => {
      return await prisma.course.update({
        where: { id },
        data: {
          title,
          duration,
          description,
          modules: modules || undefined,
          hasCertificate,
          image,
          price: price ? parseFloat(price) : null,
        },
      });
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (err: unknown) {
    console.error("Update course error:", err);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await withDbRetry(async () => {
      await prisma.course.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (err: unknown) {
    console.error("Delete course error:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
