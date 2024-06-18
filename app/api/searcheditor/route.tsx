import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const searchTerm = body.searchTerm;

    if (!searchTerm) {
      return NextResponse.json(
        { msg: "Failed to get search editor value" },
        { status: 400 }
      );
    }

    const editor = await prisma.user.findUnique({
      where: { email: searchTerm },
      include: {
        editor: true,
      },
    });

    console.log("The editro is found ----------------------------", editor);

    if (!editor) {
      return NextResponse.json(
        { msg: "Editor does not exists" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      msg: "Editor found",
      editor: editor,
    });
  } catch (error) {
    console.error("Error fetching editor :", error);
    return NextResponse.json(
      {
        msg: "Failed to fetch editor profile",
      },
      { status: 500 }
    );
  }
};
