import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const enquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().optional(),
  message: z.string().optional(),
  hp_field: z.string().optional(), // Honeypot field
});

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parse = enquirySchema.safeParse(json);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, phone, email, service, message, hp_field } = parse.data;

    // Honeypot check: bots fill hidden fields
    if (hp_field) {
      // Quietly return success without saving spam
      return NextResponse.json({ success: true });
    }

    // IP rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateKey = `enquiry:${ip}`;
    const rateCheck = await checkRateLimit(rateKey, 6, 10 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many enquiries sent. Please WhatsApp or call us directly." },
        { status: 429 }
      );
    }

    // Save enquiry and ensure Customer record exists
    const cleanPhone = phone.replace(/[^0-9+]/g, "");

    const enquiry = await withDbRetry(async () => {
      // Upsert customer record
      await prisma.customer.upsert({
        where: { phone: cleanPhone },
        update: {
          name,
          email: email || undefined,
        },
        create: {
          name,
          phone: cleanPhone,
          email: email || null,
        },
      });

      return await prisma.enquiry.create({
        data: {
          name,
          phone: cleanPhone,
          email: email || null,
          service,
          message,
          status: "New",
        },
      });
    });

    return NextResponse.json({ success: true, enquiryId: enquiry.id });
  } catch (err: unknown) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please call or WhatsApp us." },
      { status: 500 }
    );
  }
}
