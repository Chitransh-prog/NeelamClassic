import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function POST() {
  try {
    const record = await withDbRetry(async () => {
      return await prisma.siteContent.findUnique({
        where: { key: "site_sections" },
      });
    });

    if (!record) {
      return NextResponse.json({ error: "No site content found to publish" }, { status: 404 });
    }

    // 1. Copy draftJson to publishedJson and create ContentVersion
    const updated = await withDbRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        const updatedRecord = await tx.siteContent.update({
          where: { key: "site_sections" },
          data: {
            publishedJson: record.draftJson as object,
          },
        });

        await tx.contentVersion.create({
          data: {
            contentKey: "site_sections",
            snapshotJson: record.draftJson as object,
            createdBy: "Admin Publish",
          },
        });

        // 2. Prune older versions: keep only the last 20 rows
        const allVersions = await tx.contentVersion.findMany({
          where: { contentKey: "site_sections" },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });

        if (allVersions.length > 20) {
          const idsToDelete = allVersions.slice(20).map((v) => v.id);
          await tx.contentVersion.deleteMany({
            where: { id: { in: idsToDelete } },
          });
        }

        return updatedRecord;
      });
    });

    // 3. Trigger on-demand ISR revalidation so public visitors get instant fresh static HTML
    try {
      revalidateTag("site-content", "max");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Published live successfully! Website cache refreshed.",
      updatedAt: updated.updatedAt,
    });
  } catch (err: unknown) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish changes" }, { status: 500 });
  }
}
