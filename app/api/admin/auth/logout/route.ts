import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, withDbRetry } from "@/lib/prisma";
import {
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await withDbRetry(async () => {
      await prisma.refreshToken.deleteMany({
        where: { tokenHash },
      });
    }).catch(() => {});
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}
