import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth";

async function handleRefresh(request: Request) {
  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!oldRefreshToken) {
    return handleInvalidToken(request);
  }

  const payload = await verifyRefreshToken(oldRefreshToken);
  if (!payload || !payload.userId) {
    return handleInvalidToken(request);
  }

  const oldHash = hashToken(oldRefreshToken);

  // Look up token hash in DB
  const tokenRecord = await withDbRetry(async () => {
    return await prisma.refreshToken.findUnique({
      where: { tokenHash: oldHash },
      include: { user: true },
    });
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    // Delete expired token if it exists
    if (tokenRecord) {
      await withDbRetry(async () => {
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      });
    }
    return handleInvalidToken(request);
  }

  // Token rotation: delete old token, create new token pair
  const newRefreshToken = await createRefreshToken({ userId: tokenRecord.userId });
  const newHash = hashToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const newAccessToken = await createAccessToken({
    userId: tokenRecord.user.id,
    email: tokenRecord.user.email,
    mustChangePassword: tokenRecord.user.mustChangePassword,
  });

  await withDbRetry(async () => {
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: tokenRecord.id } }),
      prisma.refreshToken.create({
        data: {
          tokenHash: newHash,
          userId: tokenRecord.userId,
          expiresAt,
        },
      }),
    ]);
  });

  const url = new URL(request.url);
  const redirectTarget = url.searchParams.get("redirect") || "/admin";

  let response: NextResponse;
  if (request.method === "GET") {
    response = NextResponse.redirect(new URL(redirectTarget, request.url));
  } else {
    response = NextResponse.json({ success: true });
  }

  response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 15 * 60,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}

function handleInvalidToken(request: Request) {
  const url = new URL(request.url);
  const redirectTarget = url.searchParams.get("redirect") || "/admin";

  let response: NextResponse;
  if (request.method === "GET") {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", redirectTarget);
    response = NextResponse.redirect(loginUrl);
  } else {
    response = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

export async function GET(request: Request) {
  return handleRefresh(request);
}

export async function POST(request: Request) {
  return handleRefresh(request);
}
