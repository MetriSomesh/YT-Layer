import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { getUserId } from "./utils/getUserId";
import axios from "axios";
import { getServerSession } from "next-auth";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const userId = await getUserId(request);
  // const secret = process.env.NEXTAUTH_SECRET;
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });
  // const url = request.nextUrl;

  console.log(userId);

  // if (userId) {
  //   const userType = await axios.post(
  //     "http://localhost:3000/api/getUserTypebyId",
  //     {
  //       id: parseInt(userId),
  //     }
  //   );

  //   if (
  //     token &&
  //     url.pathname.startsWith("/signin") &&
  //     userType.data.userType === "YOUTUBER"
  //   ) {
  //     return NextResponse.redirect(new URL("/ytdashboard", request.url));
  //   }
  //   if (
  //     (!token && url.pathname.startsWith("/ytdashboard")) ||
  //     url.pathname.startsWith("/eddashboard")
  //   ) {
  //     return NextResponse.redirect(new URL("/signin", request.url));
  //   }
  //   if (
  //     token &&
  //     url.pathname.startsWith("/signin") &&
  //     userType.data.userType === "EDITOR"
  //   ) {
  //     return NextResponse.redirect(new URL("/eddashboard", request.url));
  //   }
  // }

  // if (token && url.pathname.startsWith("/signin")) {
  //   console.log("Got this condition");
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // If token is not found and the user is trying to access a protected route, redirect to sign-in
  // if (!token && url.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/ytdashboard", "/eddashboard"],
};
