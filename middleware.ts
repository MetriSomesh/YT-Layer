import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["http://localhost:3000"];
export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  console.log(origin);

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad request",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

export const config = {
  matcher: "/api/:path*",
};
