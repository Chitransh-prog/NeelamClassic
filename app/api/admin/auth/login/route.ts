import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parseResult = loginSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // Client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateKey = `login:${ip}:${email}`;
    const rateCheck = await checkRateLimit(rateKey, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${Math.ceil(
            (rateCheck.retryAfterSeconds || 60) / 60
          )} minutes.`,
        },
        { status: 429 }
      );
    }

    // Neon retry wrapped db query
    const admin = await withDbRetry(async () => {
      return await prisma.adminUser.findUnique({
        where: { email },
      });
    });

    // Constant-time compare dummy hash if admin not found to mitigate timing attacks
    const dummyHash = "$2a$12$e80yq9gPzYtG5e7yHw9zYe.K7nSgP3rS1Y9j2oZ4k8xWmNpQrStUu";
    const passwordMatch = admin
      ? await bcrypt.compare(password, admin.passwordHash)
      : await bcrypt.compare(password, dummyHash);

    if (!admin || !passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Reset rate limit on successful credentials
    await resetRateLimit(rateKey);

    // Create tokens
    const accessToken = await createAccessToken({
      userId: admin.id,
      email: admin.email,
      mustChangePassword: admin.mustChangePassword,
    });

    const refreshToken = await createRefreshToken({ userId: admin.id });
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store refresh token hash in DB
    await withDbRetry(async () => {
      await prisma.refreshToken.create({
        data: {
          tokenHash,
          userId: admin.id,
          expiresAt,
        },
      });
    });

    const response = NextResponse.json({
      success: true,
      mustChangePassword: admin.mustChangePassword,
    });

    // Set HTTP-only secure cookies
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 15 * 60, // 15 mins
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
