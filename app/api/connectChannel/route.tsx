import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { msg: "Failed to get youtuberId" },
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
        { msg: "Channel does not exist" },
        { status: 404 }
      );
    }

    const connectChannel = await prisma.invitation.update({
      where: { youtuberId: id },
      data: {
        channel: { connect: { id: accessChannel.id } },
      },
      include: {
        channel: true,
      },
    });

    if (!connectChannel) {
      await prisma.$disconnect();
      return NextResponse.json({
        msg: "Unable to connect channel to invitation table",
        status: 401,
      });
    }

    console.log(
      "The channel is connected ----------------------------",
      connectChannel
    );
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "Channel connected",
      channelInfo: connectChannel,
      status: 200,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error connecting channel:", error);
    return NextResponse.json(
      {
        msg: "Failed to connect channel to invitation",
      },
      { status: 500 }
    );
  }
};
