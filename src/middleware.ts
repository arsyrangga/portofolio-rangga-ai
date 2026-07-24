import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");

  if (host === "siti-chan.rangga.click") {
    return NextResponse.rewrite(
      new URL("/siti-chan", req.url)
    );
  }

  return NextResponse.next();
}
