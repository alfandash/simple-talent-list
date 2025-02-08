import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/";

  console.log("authCookie");

  const authCookie = request.cookies.get("auth")?.value;

  const isAuthenticated = !!authCookie;

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/list", request.url));
  }

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
