import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  verifyAccessToken,
  createAccessToken,
  createRefreshToken,
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(10, "New password must be at least 10 characters long")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "New password must contain at least one symbol"),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json().catch(() => ({}));
    const parseResult = changePasswordSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parseResult.data;

    const user = await withDbRetry(async () => {
      return await prisma.adminUser.findUnique({
        where: { id: payload.userId },
      });
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    // Update password, clear mustChangePassword, invalidate previous refresh tokens
    await withDbRetry(async () => {
      await prisma.$transaction([
        prisma.adminUser.update({
          where: { id: user.id },
          data: {
            passwordHash: newHash,
            mustChangePassword: false,
          },
        }),
        prisma.refreshToken.deleteMany({
          where: { userId: user.id },
        }),
      ]);
    });

    // Issue new tokens with mustChangePassword = false
    const newAccessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      mustChangePassword: false,
    });

    const newRefreshToken = await createRefreshToken({ userId: user.id });
    const tokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await withDbRetry(async () => {
      await prisma.refreshToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
      });
    });

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }
}
