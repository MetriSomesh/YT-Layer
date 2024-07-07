import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    await prisma.$connect();
    const body = await req.json();
    const { invitationId, status } = body;

    if (!invitationId || !status) {
      await prisma.$disconnect();
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "Invitation does not exists" },
        { status: 404 }
      );
    }

    const newNotification = await prisma.youTuberNotification.create({
      data: {
        youtuberId: invitation.youtuberId,
        editorId: invitation.editorId,
        status: status,
      },
    });

    if (!newNotification) {
      await prisma.$disconnect();
      return NextResponse.json(
        {
          msg: "Failed to create notification",
        },
        { status: 500 }
      );
    }
    await prisma.$disconnect();
    return NextResponse.json(
      {
        msg: "Notification created successfully",
        newNotification,
      },
      { status: 200 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    return NextResponse.json(
      {
        msg: error,
      },
      { status: 500 }
    );
  }
};
