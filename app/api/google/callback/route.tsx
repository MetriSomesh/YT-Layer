import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";


export const GET = async (req: NextRequest) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URI;

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
              console.log("Channel created");
            }
          } else {
            console.log("user not found for the channle");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No channel info found");
      }
    }
    return NextResponse.redirect(
      new URL("/signin", process.env.NEXTAUTH_URL || req.nextUrl.origin)
    );
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
