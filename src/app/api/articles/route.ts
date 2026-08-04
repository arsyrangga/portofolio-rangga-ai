import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://blogyra.site/api/blog/articles", {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJibG9neXJhIiwiZXhwIjoxNzg1Mzc0MzA0fQ.H4Zt7uCQbyAb7sT60cZGKwuSoNGL0RtU04U1DKYRC5k",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch articles from Blogyra" },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      data.sort(
        (a: { date?: string }, b: { date?: string }) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error fetching articles" },
      { status: 500 }
    );
  }
}
