import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import OAUTH2Data from "../../../credentials.json";
import { middleware } from "../../middleware";

export const GET = async (req: NextRequest) => {
  const CLIENT_ID = OAUTH2Data.web.client_id;
  const CLIENT_SECRET = OAUTH2Data.web.client_secret;
  const REDIRECT_URL = OAUTH2Data.web.redirect_uris[0];

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  ];

  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
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
