import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    prisma.$connect();
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      );
    }
    const vdResult = await cloudinary.api.resource(publicId, {
      resource_type: "video",
    });
    const secure_url = vdResult.secure_url;

    const result = await prisma.video.findFirst({
      where: { publicId: publicId },
    });

    if (!result) {
      const result = await prisma.video.findFirst({
        where: { publicId: publicId },
      });

      const videoDelivery = {
        publicId: publicId,
        format: result?.format,
        playbackUrl: result?.playbackUrl,
        duration: result?.duration,
        secure_url,
        title:result?.title,
        descrption:result?.description,
        tags:result?.tags,
        thumbnail:result?.thumbnail
      };
    }

    const videoDelivery = {
      publicId: publicId,
      format: result?.format,
      playbackUrl: result?.playbackUrl,
      duration: result?.duration,
      secure_url,
      title: result?.title,
      descrption: result?.description,
      tags: result?.tags,
      thumbnail: result?.thumbnail,
    };

    return NextResponse.json(videoDelivery);
  } catch (error) {
    console.error("Error fetching video delivery:", error);
    return NextResponse.json(
      { error: "Failed to fetch video delivery information" },
      { status: 500 }
    );
  }
}
