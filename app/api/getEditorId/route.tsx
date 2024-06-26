import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { msg: "Failed to get editor ID" },
        { status: 400 }
      );
    }
    await prisma.$connect();
    const editor = await prisma.user.findUnique({
      where: { id: id },
      include: {
        editor: true,
      },
    });

    console.log(
      "The editor is found ----------------------------",
      editor?.editor?.id
    );

    if (!editor) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "editor does not exists" },
        { status: 404 }
      );
    }
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "editor found",
      editor: editor.editor?.id,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error fetching editor :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch editor profile",
      },
      { status: 500 }
    );
  }
};
