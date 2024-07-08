import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData = await req.formData();

  try {
    await prisma.$connect();
    if (!formData) {
      await prisma.$disconnect();
      return NextResponse.json(
        {
          msg: "Form data did not received",
        },
        { status: 400 }
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const youtuberId = parseInt(formData.get("youtuberId") as string, 10);

    if (isNaN(youtuberId)) {
      return NextResponse.json({ msg: "Invalid youtuberId" }, { status: 400 });
    }

    const newVideo = await prisma.video.create({
      data: {
        title: title,
        description: description,
        tags: tags,
        url: videoUrl,
        thumbnail: thumbnailUrl,
        youtuberId: youtuberId,
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
