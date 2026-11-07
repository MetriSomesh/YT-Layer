import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }
    const notification = await prisma.youTuberNotification.delete({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { msg: "Notification does not exists" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      msg: "Notification deleted successfully",
    });
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
