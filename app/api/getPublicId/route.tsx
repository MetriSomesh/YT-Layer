import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { youtuberId, editorId } = body;

  try {

    if (!editorId && !youtuberId) {
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
      return NextResponse.json(
        {
          msg: "Public Id is not present",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        msg: "Public Id exists",
        publicId: pubId.publicId,
      },
      { status: 200 }
    );
  } catch (error) {
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
