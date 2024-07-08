import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500mb",
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileStr } = body;

    if (!fileStr) {
      return NextResponse.json(
        { error: "No file data provided" },
        { status: 400 }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      resource_type: "video",
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    if (!uploadResponse) {
      return NextResponse.json(
        { error: "Unable to upload Video to Cloudinary" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        msg: "Video uploaded succesfully",
        data: uploadResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
