import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (status && status !== "All") {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { bookingNumber: { contains: query, mode: "insensitive" } },
        { clientName: { contains: query, mode: "insensitive" } },
        { clientPhone: { contains: query } },
        { serviceType: { contains: query, mode: "insensitive" } },
        { pickupLocation: { contains: query, mode: "insensitive" } },
      ];
    }

    const bookings = await withDbRetry(async () => {
      return await prisma.booking.findMany({
        where,
        orderBy: [{ scheduleDate: "desc" }, { createdAt: "desc" }],
      });
    });

    let totalRevenue = 0;
    let totalPendingDue = 0;
    let pendingCount = 0;
    let confirmedCount = 0;

    for (const b of bookings) {
      totalRevenue += Number(b.totalAmount);
      totalPendingDue += Number(b.balanceDue);
      if (b.status === "Pending") pendingCount++;
      if (b.status === "Confirmed" || b.status === "On The Way") confirmedCount++;
    }

    return NextResponse.json({
      bookings,
      summary: {
        total: bookings.length,
        totalRevenue,
        totalPendingDue,
        pendingCount,
        confirmedCount,
      },
    });
  } catch (err: unknown) {
    console.error("Get bookings error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientPhone,
      clientEmail,
      serviceType,
      scheduleDate,
      scheduleTime,
      pickupLocation,
      latitude,
      longitude,
      distanceKm = 0,
      deliveryCharges = 0,
      serviceAmount = 0,
      status = "Pending",
      totalAmount = 0,
      advancePaid = 0,
      paymentMode = "UPI",
      notes,
    } = body;

    if (!clientName || !clientPhone || !scheduleDate) {
      return NextResponse.json(
        { error: "Client name, phone and schedule date are required" },
        { status: 400 }
      );
    }

    const srvNum = Number(serviceAmount) || 0;
    const delNum = Number(deliveryCharges) || 0;
    const totalNum = Number(totalAmount) || srvNum + delNum;
    const advanceNum = Number(advancePaid) || 0;
    const balanceDueNum = Math.max(0, totalNum - advanceNum);
    const distNum = Number(distanceKm) || 0;

    const year = new Date(scheduleDate).getFullYear();

    const booking = await withDbRetry(async () => {
      // Find latest booking sequence for current year
      const count = await prisma.booking.count();
      const sequence = count + 1;
      const bookingNumber = `NCB-${year}-${String(sequence).padStart(4, "0")}`;

      // Upsert Customer record to keep client directory updated
      await prisma.customer.upsert({
        where: { phone: clientPhone.trim() },
        update: {
          name: clientName.trim(),
          email: clientEmail ? clientEmail.trim() : undefined,
          notes: notes ? `Booking ${bookingNumber}: ${notes}` : undefined,
        },
        create: {
          name: clientName.trim(),
          phone: clientPhone.trim(),
          email: clientEmail ? clientEmail.trim() : null,
          notes: notes || null,
        },
      });

      return await prisma.booking.create({
        data: {
          bookingNumber,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          clientEmail: clientEmail ? clientEmail.trim() : null,
          serviceType: serviceType || "Bridal / Salon Service",
          scheduleDate: new Date(scheduleDate),
          scheduleTime: scheduleTime || "10:30 AM",
          pickupLocation: pickupLocation || null,
          latitude: latitude ? parseFloat(String(latitude)) : null,
          longitude: longitude ? parseFloat(String(longitude)) : null,
          distanceKm: distNum,
          deliveryCharges: delNum,
          serviceAmount: srvNum,
          status,
          totalAmount: totalNum,
          advancePaid: advanceNum,
          balanceDue: balanceDueNum,
          paymentMode,
          notes: notes || null,
        },
      });
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create booking error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create booking" },
      { status: 500 }
    );
  }
}
