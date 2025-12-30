import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value || null;
  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/login",
  ];

  // Allow Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // ============================================
  // CASE 1: NO TOKEN → only allow public routes
  // ============================================
  if (!token) {
    const isPublicPage = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isPublicPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // ============================================
  // CASE 2: TOKEN EXISTS → block access to public pages
  // ============================================
  const isPublicPage = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicPage) {
    return NextResponse.redirect(new URL("/", req.url)); // dashboard/home
  }

  // Otherwise, allow access to protected pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
