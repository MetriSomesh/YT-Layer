import { UserType } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    const accessChannel = await prisma.channel.findUnique({
      where: { youtuberId: id },
    });

    if (!accessChannel) {
      return NextResponse.json(
        { msg: "channel does not exists" },
        { status: 404 }
      );
    }

    console.log(
      "The channel is found ----------------------------",
      accessChannel
    );
    return NextResponse.json({
      msg: "channel connected",
      channelInfo: accessChannel,
    });
  } catch (error) {
    console.error("Error fetching  channel info :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch channel info ",
      },
      { status: 500 }
    );
  }
};
