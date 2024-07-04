import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OAUTH2Data from "../../../credentials.json";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const CLIENT_ID = OAUTH2Data.web.client_id;
  const CLIENT_SECRET = OAUTH2Data.web.client_secret;
  const REDIRECT_URL = OAUTH2Data.web.redirect_uris[0];

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

  try {
    const body = await req.json();
    const { youtuberId } = body;

    if (!youtuberId) {
      return NextResponse.json({ msg: "Youtuber Id not found", status: 400 });
    }

    const youtuber = await prisma.youTuber.findUnique({
      where: { id: youtuberId },
      select: {
        accessToken: true,
        refreshToken: true,
      },
    });

    if (!youtuber) {
      return NextResponse.json({
        msg: "Youtuber record not found",
        status: 400,
      });
    }
    const existingChannel = await prisma.channel.findFirst({
      where: { youtuberId: youtuberId },
    });

    if (existingChannel) {
      return NextResponse.json({
        msg: "Channel already exists for this YouTuber",
        status: 400,
      });
    }

    oAuth2Client.setCredentials({
      access_token: youtuber.accessToken,
      refresh_token: youtuber.refreshToken,
    });

    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    const channelResponse = await youtube.channels.list({
      part: ["snippet", "contentDetails", "statistics"],
      mine: true,
    });

    const channelInfo = channelResponse.data.items?.[0];

    if (!channelInfo) {
      return NextResponse.json({
        msg: "Unable to get channelInfo from the YouTube API",
        status: 401,
      });
    }

    const channels = await prisma.channel.create({
      data: {
        youtuber: { connect: { id: youtuberId } },
        channelId: channelInfo.id!,
        title: channelInfo.snippet?.title?.toString() || "",
        ChannelPic:
          channelInfo.snippet?.thumbnails?.default?.url?.toString() || "",
        description: channelInfo.snippet?.description?.toString() || "",
        viewCount: channelInfo.statistics?.viewCount?.toString() || "",
        videoCount: channelInfo.statistics?.videoCount?.toString() || "",
        subscriberCount:
          channelInfo.statistics?.subscriberCount?.toString() || "",
        hiddenSubsCount: channelInfo.statistics?.hiddenSubscriberCount || false,
      },
    });

    if (!channels) {
      return NextResponse.json({
        msg: "Unable to create channel record",
        status: 400,
      });
    }

    return NextResponse.json({ channel: channels });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal server error", error: error });
  } finally {
    await prisma.$disconnect();
  }
};
