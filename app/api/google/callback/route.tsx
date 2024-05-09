import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import OAUTH2Data from "../../../../credentials.json";

export const GET = async (req: NextRequest) => {
  const CLIENT_ID = OAUTH2Data.web.client_id;
  const CLIENT_SECRET = OAUTH2Data.web.client_secret;
  const REDIRECT_URL = OAUTH2Data.web.redirect_uris[0];

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

  // const { code } = await req.nextUrl.searchParams.get('code') || "" // Assuming the authorization code is passed as a query parameter
  const queryParams = new URLSearchParams(req.nextUrl.searchParams);
  const code = queryParams.get("code");

  try {
    // Exchange authorization code for access token
    const { tokens } = await oAuth2Client.getToken(code as string);
    const accessToken = tokens.access_token;
    // const expiryTime = new Date().getTime() + tokens.expires_in * 1000;
    // Return the access token
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error(
      "Error exchanging authorization code for access token:",
      error
    );
    return NextResponse.json(
      {
        msg: "Failed to obtain access token",
      },
      { status: 500 }
    );
  }
};
