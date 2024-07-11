import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
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
    await prisma.$connect();
    const youtuberInfo = await prisma.youTuber.findUnique({
      where: { id: id },
      include: { editor: true },
    });

    if (!youtuberInfo?.editor?.youtuberId === id) {
      await prisma.$disconnect();
      return NextResponse.json({ msg: "Editor not assigned" }, { status: 404 });
    }

    if (youtuberInfo?.editor == null) {
      await prisma.$disconnect();
      return NextResponse.json({ msg: "Editor not assigned" }, { status: 404 });
    }
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "Editor is assigned",
      editor: youtuberInfo?.editor,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error fetching  editor info :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch editor info ",
      },
      { status: 500 }
    );
  }
};
