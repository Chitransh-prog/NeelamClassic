import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await withDbRetry(async () => {
      return await prisma.booking.findUnique({
        where: { id },
      });
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (err: unknown) {
    console.error("Get booking details error:", err);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const booking = await withDbRetry(async () => {
      const existing = await prisma.booking.findUnique({ where: { id } });
      if (!existing) throw new Error("Booking not found");

      const updateData: Record<string, unknown> = {};

      if (body.status !== undefined) updateData.status = body.status;
      if (body.scheduleDate !== undefined) updateData.scheduleDate = new Date(body.scheduleDate);
      if (body.scheduleTime !== undefined) updateData.scheduleTime = body.scheduleTime;
      if (body.pickupLocation !== undefined) updateData.pickupLocation = body.pickupLocation;
      if (body.latitude !== undefined) updateData.latitude = body.latitude ? parseFloat(String(body.latitude)) : null;
      if (body.longitude !== undefined) updateData.longitude = body.longitude ? parseFloat(String(body.longitude)) : null;
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.serviceType !== undefined) updateData.serviceType = body.serviceType;
      if (body.paymentMode !== undefined) updateData.paymentMode = body.paymentMode;
      if (body.distanceKm !== undefined) updateData.distanceKm = Number(body.distanceKm);
      if (body.deliveryCharges !== undefined) updateData.deliveryCharges = Number(body.deliveryCharges);
      if (body.serviceAmount !== undefined) updateData.serviceAmount = Number(body.serviceAmount);

      if (body.advancePaid !== undefined || body.totalAmount !== undefined) {
        const total = body.totalAmount !== undefined ? Number(body.totalAmount) : Number(existing.totalAmount);
        const advance = body.advancePaid !== undefined ? Number(body.advancePaid) : Number(existing.advancePaid);
        updateData.totalAmount = total;
        updateData.advancePaid = advance;
        updateData.balanceDue = Math.max(0, total - advance);
      }

      return await prisma.booking.update({
        where: { id },
        data: updateData,
      });
    });

    return NextResponse.json({ booking });
  } catch (err: unknown) {
    console.error("Update booking error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await withDbRetry(async () => {
      return await prisma.booking.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete booking error:", err);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
