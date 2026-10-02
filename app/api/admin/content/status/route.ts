import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const record = await withDbRetry(async () => {
      return await prisma.siteContent.findUnique({
        where: { key: "site_sections" },
      });
    });

    if (!record) {
      return NextResponse.json({ hasUnpublishedChanges: false });
    }

    const draftStr = JSON.stringify(record.draftJson);
    const pubStr = JSON.stringify(record.publishedJson);
    const hasUnpublishedChanges = draftStr !== pubStr;

    return NextResponse.json({
      hasUnpublishedChanges,
      updatedAt: record.updatedAt,
    });
  } catch {
    return NextResponse.json({ hasUnpublishedChanges: false });
  }
}
