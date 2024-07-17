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
    const refreshToken = tokens.refresh_token;
    oAuth2Client.setCredentials(tokens);

    // console.log("Tokens asdklfj : ", tokens.refresh_token);

    const { data } = await google
      .oauth2({ version: "v2", auth: oAuth2Client })
      .userinfo.get();

    const userEmail = data.email || "";

    // const user = await prisma.user.findFirst({
    //   where: { id: req.user.id }, // Assuming you have the authenticated user's id in req.user
    // });
    await prisma.$connect();
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    });

    if (accessToken && refreshToken) {
      const newYoutuber = await prisma.youTuber.create({
        data: {
          user: { connect: { id: user?.id } },
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });

      console.log("refresh Token", refreshToken);

      const youtube = google.youtube({
        version: "v3",
        auth: oAuth2Client,
      });
      const channelResponse = await youtube.channels.list({
        part: ["snippet", "contentDetails", "statistics"],
        mine: true,
      });

      const channelInfo = channelResponse.data.items?.[0];
      if (channelInfo) {
        console.log("YouTube Channel Info:", channelInfo);
        const profilePicture = channelInfo?.snippet?.thumbnails?.default?.url;
        console.log("Profile Picture URL:", profilePicture);
        try {
          await prisma.$connect();
          if (user) {
            const youtuberId = await prisma.youTuber.findUnique({
              where: {
                userId: user.id,
              },
              select: {
                id: true,
              },
            });
            if (youtuberId) {
              console.log("youtuber id", youtuberId);
              const channels = await prisma.channel.create({
                data: {
                  youtuber: { connect: { id: youtuberId.id } },
                  channelId: channelInfo.id!,
                  title: channelInfo.snippet?.title?.toString() || "",
                  ChannelPic:
                    channelInfo.snippet?.thumbnails?.default?.url?.toString() ||
                    "",
                  description:
                    channelInfo.snippet?.description?.toString() || "",
                  viewCount:
                    channelInfo.statistics?.viewCount?.toString() || "",
                  videoCount:
                    channelInfo.statistics?.videoCount?.toString() || "",
                  subscriberCount:
                    channelInfo.statistics?.subscriberCount?.toString() || "",
                  hiddenSubsCount:
                    channelInfo.statistics?.hiddenSubscriberCount || false,
                },
              });
              await prisma.$disconnect();
              console.log("Channel created");
            }
          } else {
            console.log("user not found for the channle");
          }
        } catch (error) {
          await prisma.$disconnect();
          console.error(error);
        }
      } else {
        console.log("No channel info found");
      }
    }
    await prisma.$disconnect();
    return NextResponse.redirect("https://yt-layer-rho.vercel.app/signin");
  } catch (error) {
    await prisma.$disconnect();
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
