import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "fallback_neelam_access_secret_super_secure_min_32_bytes_long"
);

const ACCESS_COOKIE = "ncs_access_token";
const REFRESH_COOKIE = "ncs_refresh_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login routes and refresh endpoints without token check
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/refresh"
  ) {
    // If user is already authenticated with access token and hits /admin/login, redirect to /admin
    if (pathname === "/admin/login") {
      const token = request.cookies.get(ACCESS_COOKIE)?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, ACCESS_SECRET);
          if (payload) {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        } catch {
          // invalid or expired token, proceed to login page
        }
      }
    }
    return NextResponse.next();
  }

  // 2. Protect /admin/* and /api/admin/*
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    // Public routes: allow iframe embed from same origin for live visual editor
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    return response;
  }

  // 3. CSRF origin check on mutating admin API requests
  if (isAdminApi && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Malformed origin" }, { status: 403 });
      }
    }
  }

  // 4. Verify access token
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let verifiedPayload: { userId?: string; mustChangePassword?: boolean } | null = null;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);
      verifiedPayload = payload as { userId?: string; mustChangePassword?: boolean };
    } catch {
      verifiedPayload = null;
    }
  }

  // If access token is invalid or expired
  if (!verifiedPayload) {
    // If it's an API route, return 401
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Unauthorized", needsRefresh: Boolean(refreshToken) },
        { status: 401 }
      );
    }

    // For web admin pages:
    // If refresh token is present, redirect to refresh handler with return URL
    if (refreshToken) {
      const refreshUrl = new URL("/api/admin/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // Otherwise redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Check mustChangePassword constraint
  if (
    verifiedPayload.mustChangePassword &&
    pathname !== "/admin/settings/password" &&
    pathname !== "/api/admin/auth/change-password" &&
    pathname !== "/api/admin/auth/logout"
  ) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Password change required", code: "MUST_CHANGE_PASSWORD" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/admin/settings/password", request.url));
  }

  // 6. Security headers for admin responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
