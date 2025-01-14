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
    const invitations = await prisma.invitation.findMany({
      where: {
        editorId: editorId,
        viewed: false,
      },
      include: {
        channel: true,
      },
    });

    await prisma.$disconnect();

    if (invitations.length === 0) {
      return NextResponse.json({ msg: "No new invitations" }, { status: 201 });
    }

    return NextResponse.json(
      {
        msg: "Invitation Found",
        invitation: invitations,
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
