import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { channelName, apiKey, email } = body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const existingChannel = await prisma.youTuber.findFirst({
    where: { channelName },
  });

  if (existingChannel) {
    return NextResponse.json({
      msg: "Already done setting up your account",
    });
  }

  if (!existingUser) {
    return NextResponse.json({
      msg: "Your account does not exists or not a Youtuber",
    });
  }

  try {
    console.log(apiKey);
    const newUser = await prisma.youTuber.create({
      data: {
        user: { connect: { id: existingUser.id } },
        api_key: apiKey,
        channelName: channelName,
      },
    });

    if (!newUser) {
      return NextResponse.json({
        msg: "Something went wrong",
      });
    }

    return NextResponse.json({
      msg: "Account Setup Successfull",
    });
  } catch (error) {
    console.error("Error occurred during account setup:", error);
    return NextResponse.json({
      error: "Internal Server Error",
    });
  }
};
