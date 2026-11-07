import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { invitationId, status } = body;

    if (!invitationId || !status) {
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
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
      return NextResponse.json(
        {
          msg: "Failed to create notification",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        msg: "Notification created successfully",
        newNotification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        msg: error,
      },
      { status: 500 }
    );
  }
};
