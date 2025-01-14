import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { youtuberId, editorId, message, status } = body;

    if (!youtuberId || !editorId || !message) {
      return NextResponse.json({ msg: "Fill all the fields" }, { status: 500 });
    }
    await prisma.$connect();

    const isInvitationExists = await prisma.invitation.findUnique({
      where: {
        youtuberId: youtuberId,
      },
    });

    if (isInvitationExists) {
      return NextResponse.json(
        {
          msg: "Invitation already sent",
        },
        { status: 201 }
      );
    }
    const invitation = await prisma.invitation.create({
      data: {
        youtuber: {
          connect: { id: youtuberId },
        },
        editor: {
          connect: { id: editorId },
        },
        message,
        status,
      },
      include: {
        youtuber: true,
        editor: true,
      },
    });

    if (!invitation) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "Failed to create invitation instatnce" },
        { status: 400 }
      );
    }
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "Invitation is created sucessfully",
      invitation: invitation,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error creating invitation :", error);
    return NextResponse.json(
      {
        msg: "Faild to create invitation",
      },
      { status: 500 }
    );
  }
};
