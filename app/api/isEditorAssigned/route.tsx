import { UserType } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { msg: "Failed to get youtberId" },
        { status: 400 }
      );
    }
    const youtuberInfo = await prisma.youTuber.findUnique({
      where: { id: id },
      include: { editor: true },
    });

    if (!youtuberInfo?.editor?.youtuberId === id) {
      return NextResponse.json({ msg: "Editor not assigned" }, { status: 404 });
    }

    if (youtuberInfo?.editor == null) {
      return NextResponse.json({ msg: "Editor not assigned" }, { status: 404 });
    }
    return NextResponse.json({
      msg: "Editor is assigned",
      editor: youtuberInfo?.editor,
    });
  } catch (error) {
    console.error("Error fetching  editor info :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch editor info ",
      },
      { status: 500 }
    );
  }
};
