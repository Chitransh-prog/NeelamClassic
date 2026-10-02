import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const versions = await withDbRetry(async () => {
      return await prisma.contentVersion.findMany({
        where: { contentKey: "site_sections" },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          createdAt: true,
          createdBy: true,
        },
      });
    });

    return NextResponse.json({ versions });
  } catch (err: unknown) {
    console.error("List versions error:", err);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { versionId } = await request.json();
    if (!versionId) {
      return NextResponse.json({ error: "Version ID is required" }, { status: 400 });
    }

    const version = await withDbRetry(async () => {
      return await prisma.contentVersion.findUnique({
        where: { id: versionId },
      });
    });

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // Restore to draftJson
    const updated = await withDbRetry(async () => {
      return await prisma.siteContent.update({
        where: { key: "site_sections" },
        data: {
          draftJson: version.snapshotJson as object,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Version restored to draft",
      draftJson: updated.draftJson,
    });
  } catch (err: unknown) {
    console.error("Restore version error:", err);
    return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
  }
}
