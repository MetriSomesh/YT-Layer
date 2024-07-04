import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { msg: "Failed to get youtberId" },
        { status: 400 }
      );
    }
    await prisma.$connect();
    const accessChannel = await prisma.channel.findUnique({
      where: { youtuberId: id },
    });

    if (!accessChannel) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "channel does not exists" },
        { status: 404 }
      );
    }

    console.log(
      "The channel is found ----------------------------",
      accessChannel
    );
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "channel connected",
      channelInfo: accessChannel,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error fetching  channel info :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch channel info ",
      },
      { status: 500 }
    );
  }
};
