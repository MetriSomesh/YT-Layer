import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { invitationId } = body;

  if (!invitationId) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  try {
    await prisma.$connect();
    const invitation = await prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        viewed: true,
      },
    });

    await prisma.$disconnect();

    if (invitation.viewed === false) {
      return NextResponse.json(
        {
          msg: "Failed mark as read",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        msg: "Invitation is marked as read",
        invitation: invitation,
      },
      { status: 200 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error(
      "Error occured while trying invitation to mark as read:",
      error
    );
    return NextResponse.json(
      {
        msg: "Failed to mark as read",
      },
      { status: 500 }
    );
  }
};
