import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OAUTH2Data from "../../../../credentials.json";
const prisma = new PrismaClient();

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
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oAuth2Client,
    });

    const { tokens } = await oAuth2Client.getToken(code as string);
    const accessToken = tokens.access_token;
    // oAuth2Client.setCredentials(tokens);
    const expiryTime = tokens.expiry_date;
    // Return the access token
    // const { data } = await google
    //   .oauth2({ version: "v2", auth: oAuth2Client })
    //   .userinfo.get();

    // const name = data.name;
    // const pic = data.picture;

    // console.log(name);
    const user = await prisma.user.findFirst({
      where: { id: req.user.id }, // Assuming you have the authenticated user's id in req.user
    });

    await prisma.youTuber.create({
      data: {
        accessToken: accessToken || "",
        refreshToken: expiryTime?.toString() || "", // Convert expiry time to milliseconds
        // Other fields if needed
      },
    });

    return NextResponse.redirect("/dashboard");
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
