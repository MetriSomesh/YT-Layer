import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { youtuberId, editorId } = body;

  try {
    await prisma.$connect();

    if (!editorId && !youtuberId) {
      prisma.$disconnect();
      return NextResponse.json(
        {
          msg: "Id not found",
        },
        { status: 400 }
      );
    }

    let pubId;

    if (editorId) {
      pubId = await prisma.video.findUnique({
        where: { editorId: editorId },
      });
    }

    if (!pubId && youtuberId) {
      pubId = await prisma.video.findUnique({
        where: { youtuberId: youtuberId },
      });
    }

    if (!pubId) {
      prisma.$disconnect();
      return NextResponse.json(
        {
          msg: "Public Id is not present",
        },
        { status: 404 }
      );
    }

    await prisma.$disconnect();
    return NextResponse.json(
      {
        msg: "Public Id exists",
        publicId: pubId.publicId,
      },
      { status: 200 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error occurred :", error);
    return NextResponse.json(
      {
        msg: "Something went wrong",
        error: error,
      },
      { status: 500 }
    );
  }
};
