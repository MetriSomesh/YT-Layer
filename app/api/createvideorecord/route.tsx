import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    await prisma.$connect();

    const body = await req.json();
    const { publicId, ...formData } = body;

    if (!formData) {
      await prisma.$disconnect();
      return NextResponse.json(
        {
          msg: "Form data not received",
        },
        { status: 400 }
      );
    }

    if (!publicId) {
      return NextResponse.json(
        { msg: "Public ID is required" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      tags,
      thumbnailUrl,
      youtuberId,
      editorId,
      format,
      playbackUrl,
      duration,
    } = formData;

    if (typeof youtuberId !== "number" || isNaN(youtuberId)) {
      return NextResponse.json({ msg: "Invalid youtuberId" }, { status: 400 });
    }

    const newVideo = await prisma.video.create({
      data: {
        title,
        description,
        tags,
        publicId,
        thumbnail: thumbnailUrl,
        youtuberId,
        editorId,
        format,
        playbackUrl,
        duration,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(
      {
        msg: "Video record created successfully",
        video: newVideo,
      },
      { status: 201 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error creating video record:", error);
    return NextResponse.json(
      {
        msg: "Failed to create video",
      },
      { status: 500 }
    );
  }
};
