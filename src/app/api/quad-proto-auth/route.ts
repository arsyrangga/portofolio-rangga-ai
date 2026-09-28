import { NextResponse } from "next/server";
import {
  QUAD_PROTO_PASSWORD,
  QUAD_AUTH_COOKIE_NAME,
  generateQuadAuthToken,
} from "@/lib/quad-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password harus diisi." },
        { status: 400 }
      );
    }

    if (password.trim() !== QUAD_PROTO_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Password salah. Silakan coba lagi." },
        { status: 401 }
      );
    }

    const token = await generateQuadAuthToken();
    const response = NextResponse.json({ success: true });

    // Set browser session cookie (no maxAge / expires so it clears on browser close)
    response.cookies.set({
      name: QUAD_AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
