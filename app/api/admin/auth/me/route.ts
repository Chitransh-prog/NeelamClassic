import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  verifyAccessToken,
  createAccessToken,
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await withDbRetry(async () => {
      return await prisma.adminUser.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          mustChangePassword: true,
          createdAt: true,
        },
      });
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err: unknown) {
    console.error("Get admin user error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  action: z.enum(["update_email", "sign_out_all_devices"]).optional(),
});

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json().catch(() => ({}));
    const parse = updateProfileSchema.safeParse(json);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { email, action } = parse.data;

    if (action === "sign_out_all_devices") {
      await withDbRetry(async () => {
        await prisma.refreshToken.deleteMany({
          where: { userId: payload.userId },
        });
      });
      return NextResponse.json({ success: true, message: "Signed out of all other sessions" });
    }

    if (email) {
      const updatedUser = await withDbRetry(async () => {
        return await prisma.adminUser.update({
          where: { id: payload.userId },
          data: { email: email.toLowerCase() },
        });
      });

      const newAccessToken = await createAccessToken({
        userId: updatedUser.id,
        email: updatedUser.email,
        mustChangePassword: updatedUser.mustChangePassword,
      });

      const response = NextResponse.json({
        success: true,
        message: "Email updated successfully",
        user: { email: updatedUser.email },
      });

      response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 15 * 60,
      });

      return response;
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
