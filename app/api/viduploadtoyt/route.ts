import { google } from "googleapis";
import OAUTH2Data from "../../../credentials.json";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const CLIENT_ID = OAUTH2Data.web.client_id;
const CLIENT_SECRET = OAUTH2Data.web.client_secret;
const REDIRECT_URL = OAUTH2Data.web.redirect_uris[1];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    await prisma.$connect();
    const { youtuberId, videoDetails, videoUrl } = await req.json();

    const youtuber = await prisma.youTuber.findUnique({
      where: { id: youtuberId },
      select: { refreshToken: true },
    });

    if (!youtuber || !youtuber.refreshToken) {
      return NextResponse.json(
        { error: "User not found or not authorized" },
        { status: 404 }
      );
    }

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: youtuber.refreshToken,
    });

    // Get a new access token
    const { token: accessToken } = await oauth2Client.getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to refresh access token" },
        { status: 401 }
      );
    }

    // Update the access token in the database
    await prisma.youTuber.update({
      where: { id: youtuberId },
      data: { accessToken: accessToken },
    });

    // Fetch the video content
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
    });

    const params = {
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: videoDetails.title,
          description: videoDetails.description,
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        body: response.data,
      },
    };

    const res = await youtube.videos.insert(params);

    const videoId = res.data.id;

    if (!videoId) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: "Failed to upload video to YouTube" },
        { status: 500 }
      );
    }
    await prisma.$disconnect();
    return NextResponse.json({ success: true, videoId: videoId });
  } catch (error) {
    console.error("Error uploading video to YouTube:", error);
    return NextResponse.json(
      { error: "Error uploading video to YouTube" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
