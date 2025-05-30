import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const excludedPaths = [
    "/",
    "/dashboard",
    "/register",
    "/courses",
    "/settings",
  ];

  const isSystemPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/.well-known") ||
    excludedPaths.includes(pathname);

  if (isSystemPath) return NextResponse.next();

  const cookieToken = request.cookies.get("access_token")?.value;
  if (cookieToken) return NextResponse.next();

  const token = pathname.slice(1);

  // Поддержка JWT и других сложных токенов
  const isValidToken = /^[a-zA-Z0-9._-]{20,300}$/.test(token);

  if (isValidToken) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("access_token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
