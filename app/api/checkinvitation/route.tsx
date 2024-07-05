import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { editorId } = body;

  if (!editorId) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  try {
    await prisma.$connect();
    const Isinvitation = await prisma.editor.findUnique({
      where: { id: editorId },
      include: {
        invitation: true,
      },
    });

    if (!Isinvitation) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "Invitation not found" },
        { status: 404 }
      );
    }

    if (Isinvitation.invitation[0]?.viewed === true) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "Invitation already viewed" },
        { status: 404 }
      );
    }

    await prisma.$disconnect();
    return NextResponse.json(
      {
        msg: "Invitation Found",
        invitation: Isinvitation,
      },
      { status: 200 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error checking invitation:", error);
    return NextResponse.json(
      {
        msg: "Failed to check invitation",
      },
      { status: 500 }
    );
  }
};
