import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
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
    await prisma.$connect();
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
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "youtuber does not exists" },
        { status: 404 }
      );
    }
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "youtuber found",
      youtuber: youtuber.youtuber?.id,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error fetching youtuber :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch youtuber profile",
      },
      { status: 500 }
    );
  }
};
