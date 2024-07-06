import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    await prisma.$connect();
    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      await prisma.$disconnect();
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }
    const notification = await prisma.youTuberNotification.delete({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      await prisma.$disconnect();
      return NextResponse.json(
        { msg: "Notification does not exists" },
        { status: 404 }
      );
    }

    await prisma.$disconnect();
    return NextResponse.json({
      msg: "Notification deleted successfully",
    });
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
