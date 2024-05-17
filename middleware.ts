import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret: secret });
  const url = request.nextUrl;

  if (token && url.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If token is not found and the user is trying to access a protected route, redirect to sign-in
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
