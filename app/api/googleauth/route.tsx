import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";


// Reads credentials from the environment at request time, so it must not be
// baked into a static response at build time.
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URI;

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL) {
    return NextResponse.json(
      { msg: "Google OAuth is not configured on this deployment" },
      { status: 500 }
    );
  }

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly",
  ];

  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
    });
    // Return the generated URL
    return NextResponse.json({ authUrl });
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
