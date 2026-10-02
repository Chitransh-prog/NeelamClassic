import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await withDbRetry(async () => {
      return await prisma.setting.findMany();
    });

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ settings: settingsMap });
  } catch (err: unknown) {
    console.error("Get settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Record<string, string> = await request.json();

    await withDbRetry(async () => {
      for (const [key, value] of Object.entries(body)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    });

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err: unknown) {
    console.error("Save settings error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
