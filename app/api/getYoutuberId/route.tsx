import { UserType } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { msg: "Failed to get youtuber ID" },
        { status: 400 }
      );
    }
    const youtuber = await prisma.user.findUnique({
      where: { id: id },
      include: {
        youtuber: true,
      },
    });

    console.log(
      "The youtuber is found ----------------------------",
      youtuber?.youtuber?.id
    );

    if (!youtuber) {
      return NextResponse.json(
        { msg: "youtuber does not exists" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      msg: "youtuber found",
      youtuber: youtuber.youtuber?.id,
    });
  } catch (error) {
    console.error("Error fetching youtuber :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch youtuber profile",
      },
      { status: 500 }
    );
  }
};
