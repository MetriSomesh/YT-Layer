import { notificationState } from "@/app/state/notificationState";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { youtuberId } = body;

  if (!youtuberId) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  try {
    const notification = await prisma.youTuberNotification.findUnique({
      where: {
        youtuberId: youtuberId,
      },
      include: {
        editor: true,
      },
    });

    if (!notification) {
      return NextResponse.json(
        {
          msg: "Notification not found",
        },
        { status: 201 }
      );
    }
    return NextResponse.json(
      {
        msg: "Notification Found",
        notification: notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking notification:", error);
    return NextResponse.json(
      {
        msg: "Failed to check notification",
        error: error,
      },
      { status: 500 }
    );
  }
};
