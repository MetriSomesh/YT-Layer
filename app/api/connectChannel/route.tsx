import { UserType } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


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
    const accessChannel = await prisma.channel.findUnique({
      where: { youtuberId: id },
    });

    if (!accessChannel) {
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
      return NextResponse.json({
        msg: "Unable to connect channel to invitation table",
        status: 401,
      });
    }

    console.log(
      "The channel is connected ----------------------------",
      connectChannel
    );
    return NextResponse.json({
      msg: "Channel connected",
      channelInfo: connectChannel,
      status: 200,
    });
  } catch (error) {
    console.error("Error connecting channel:", error);
    return NextResponse.json(
      {
        msg: "Failed to connect channel to invitation",
      },
      { status: 500 }
    );
  }
};
