import { google } from "googleapis";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import axios from "axios";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL =
  process.env.GOOGLE_UPLOAD_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});


export const POST = async (req: NextRequest) => {
  try {
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
          tags:videoDetails.tags,
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
      return NextResponse.json(
        { error: "Failed to upload video to YouTube" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, videoId: videoId });
  } catch (error) {
    console.error("Error uploading video to YouTube:", error);
    return NextResponse.json(
      { error: "Error uploading video to YouTube" },
      { status: 500 }
    );
  } finally {
  }
};
