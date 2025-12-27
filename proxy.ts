import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // // Rewrite root to login (URL stays as '/')
  // if (request.nextUrl.pathname === '/') {
  //   return NextResponse.rewrite(new URL('/login', request.url))
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
