import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "draft";

    const contentRecord = await withDbRetry(async () => {
      return await prisma.siteContent.findUnique({
        where: { key: "site_sections" },
      });
    });

    if (!contentRecord) {
      return NextResponse.json({ error: "Site content not found" }, { status: 404 });
    }

    const content = mode === "published" ? contentRecord.publishedJson : contentRecord.draftJson;
    return NextResponse.json({ content, updatedAt: contentRecord.updatedAt });
  } catch (err: unknown) {
    console.error("Get content error:", err);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid content body" }, { status: 400 });
    }

    const updated = await withDbRetry(async () => {
      return await prisma.siteContent.upsert({
        where: { key: "site_sections" },
        update: {
          draftJson: body,
        },
        create: {
          key: "site_sections",
          draftJson: body,
          publishedJson: body,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved",
      updatedAt: updated.updatedAt,
    });
  } catch (err: unknown) {
    console.error("Save draft error:", err);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}
