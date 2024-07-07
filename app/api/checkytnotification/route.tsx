import { notificationState } from "@/app/state/notificationState";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { youtuberId } = body;

  if (!youtuberId) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  try {
    await prisma.$connect();
    const notification = await prisma.youTuberNotification.findUnique({
      where: {
        youtuberId: youtuberId,
      },
      include: {
        editor: true,
      },
    });

    await prisma.$disconnect();
    if (!notification) {
      await prisma.$disconnect();
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
    await prisma.$disconnect();
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
