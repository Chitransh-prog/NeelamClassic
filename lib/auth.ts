import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "fallback_neelam_access_secret_super_secure_min_32_bytes_long"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "fallback_neelam_refresh_secret_super_secure_min_32_bytes_long"
);

export const ACCESS_TOKEN_COOKIE = "ncs_access_token";
export const REFRESH_TOKEN_COOKIE = "ncs_refresh_token";

export interface AdminJwtPayload {
  userId: string;
  email: string;
  mustChangePassword: boolean;
  [key: string]: unknown;
}

export async function createAccessToken(payload: AdminJwtPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

export async function createRefreshToken(payload: { userId: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as { userId: string };
  } catch {
    return null;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
