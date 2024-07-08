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
    const youtuber = await prisma.editor.findUnique({
      where: { id: id },
    });

    console.log(
      "The youtuber is found ----------------------------",
      youtuber?.youtuberId
    );

    if (!youtuber?.youtuberId) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "youtuber does not assigned to the editor" },
        { status: 404 }
      );
    }
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "youtuber found",
      youtuber: youtuber.youtuberId,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error fetching youtuberId from editor :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch youtuberId from editor",
      },
      { status: 500 }
    );
  }
};
