import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUAD_AUTH_COOKIE_NAME, verifyQuadAuthToken } from "@/lib/quad-auth";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const { pathname, search } = req.nextUrl;

  // 1. Quadra Prototype Protection
  const isQuadProto = pathname === "/quad-proto" || pathname.startsWith("/quad-proto/");
  if (isQuadProto) {
    const token = req.cookies.get(QUAD_AUTH_COOKIE_NAME)?.value;
    const isAuthenticated = await verifyQuadAuthToken(token);

    if (!isAuthenticated) {
      let fromUrl = pathname + search;
      if (fromUrl === "/quad-proto" || fromUrl === "/quad-proto/") {
        fromUrl = "/quad-proto/login.html";
      }
      const accessUrl = new URL("/quad-proto-access", req.url);
      accessUrl.searchParams.set("from", fromUrl);
      return NextResponse.redirect(accessUrl);
    }

    // If authenticated and visiting root prototype path, redirect directly to login.html
    if (pathname === "/quad-proto" || pathname === "/quad-proto/") {
      return NextResponse.redirect(new URL("/quad-proto/login.html", req.url));
    }
  }

  // 2. Skip internal Next.js assets, static files, public assets, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Domain rewrites
  if (host === "siti-chan.rangga.click") {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/siti-chan", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include /quad-proto and everything under it (including static assets with extensions)
    "/quad-proto/:path*",
    // Existing general matcher
    "/((?!_next/static|_next/image|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|vrm|ico|css|js)$).*)",
  ],
};

