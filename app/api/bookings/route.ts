import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const bookingSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientPhone: z.string().min(5, "Valid phone number is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  serviceType: z.string().min(1, "Service selection is required"),
  scheduleDate: z.string().min(1, "Preferred date is required"),
  scheduleTime: z.string().optional().default("11:00 AM"),
  serviceLocationType: z.enum(["salon", "venue"]).optional().default("salon"),
  pickupLocation: z.string().optional().nullable(),
  serviceAmount: z.number().or(z.string()).optional(),
  notes: z.string().optional().nullable(),
  hp_field: z.string().optional(), // Honeypot field
});

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parse = bookingSchema.safeParse(json);

    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const {
      clientName,
      clientPhone,
      clientEmail,
      serviceType,
      scheduleDate,
      scheduleTime,
      serviceLocationType,
      pickupLocation,
      serviceAmount,
      notes,
      hp_field,
    } = parse.data;

    // Honeypot check: bots fill hidden fields
    if (hp_field) {
      return NextResponse.json({ success: true, bookingNumber: "NCB-PENDING" });
    }

    // IP rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateKey = `booking:${ip}`;
    const rateCheck = await checkRateLimit(rateKey, 8, 10 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many booking requests sent. Please contact us via WhatsApp or phone." },
        { status: 429 }
      );
    }

    const cleanPhone = clientPhone.replace(/[^0-9+]/g, "").trim();
    const cleanName = clientName.trim();
    const cleanEmail = clientEmail ? clientEmail.trim() : null;

    // Numerical amount conversion
    const srvNum = Number(serviceAmount) || 0;
    const finalLocation =
      serviceLocationType === "venue"
        ? pickupLocation?.trim() || "Client Venue / Home Visit"
        : "Salon Studio Visit (In-Salon)";

    const scheduleDateObj = new Date(scheduleDate);
    const year = isNaN(scheduleDateObj.getFullYear())
      ? new Date().getFullYear()
      : scheduleDateObj.getFullYear();

    const booking = await withDbRetry(async () => {
      // Find latest booking count for sequence
      const count = await prisma.booking.count();
      const sequence = count + 1;
      const bookingNumber = `NCB-${year}-${String(sequence).padStart(4, "0")}`;

      // Upsert Customer record to sync client directory
      await prisma.customer.upsert({
        where: { phone: cleanPhone },
        update: {
          name: cleanName,
          email: cleanEmail || undefined,
          notes: notes ? `Booking ${bookingNumber}: ${notes}` : undefined,
        },
        create: {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          notes: notes || null,
        },
      });

      // Create Booking record
      return await prisma.booking.create({
        data: {
          bookingNumber,
          clientName: cleanName,
          clientPhone: cleanPhone,
          clientEmail: cleanEmail,
          serviceType: serviceType.trim(),
          scheduleDate: scheduleDateObj,
          scheduleTime: scheduleTime || "11:00 AM",
          pickupLocation: finalLocation,
          serviceAmount: srvNum,
          totalAmount: srvNum,
          advancePaid: 0,
          balanceDue: srvNum,
          status: "Pending",
          paymentMode: "Pending",
          notes: notes ? notes.trim() : null,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          serviceType: booking.serviceType,
          scheduleDate: booking.scheduleDate,
          scheduleTime: booking.scheduleTime,
          pickupLocation: booking.pickupLocation,
          totalAmount: Number(booking.totalAmount),
          status: booking.status,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Public booking submission error:", err);
    return NextResponse.json(
      { error: "Failed to schedule appointment. Please book via WhatsApp or call us." },
      { status: 500 }
    );
  }
}
