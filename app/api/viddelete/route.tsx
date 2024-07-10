import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    await prisma.$connect();
    const { publicId } = body;
    if (!publicId) {
      return NextResponse.json(
        {
          msg: "Public Id not found",
        },
        { status: 400 }
      );
    }

    const delVideo = await prisma.video.delete({
        where:{publicId:publicId}
    });

    if(!delVideo)
    {
           const delVideo = await prisma.video.delete({
             where: { publicId: publicId },
           });
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    await prisma.$disconnect();
    return NextResponse.json(
      { msg: "Video is deleted succesfully" },
      { status: 200 }
    );
  } catch (error) {
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "Error deleting video",
      error,
    });
  }
};
