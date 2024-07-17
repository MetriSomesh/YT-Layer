// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Retrieve the current response
  const res = NextResponse.next();

  // Add the CORS headers to the response
  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append("Access-Control-Allow-Origin", "*"); // Replace '*' with your actual origin
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Check if the request is for the dashboard
  if (request.nextUrl.pathname === "/dashboard") {
    // Read the userType from cookies
    const yt = localStorage.getItem("userType");
    console.log(yt);
    const userType = request.cookies.get("userType")?.value;

    // Redirect based on user type
    if (userType === "youtuber") {
      return NextResponse.redirect(new URL("/ytdashboard", request.url));
    } else if (userType === "editor") {
      return NextResponse.redirect(new URL("/eddashboard", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/dashboard"], // Apply the middleware to all paths under '/api' and the dashboard route
};
