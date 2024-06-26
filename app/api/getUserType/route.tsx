import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ msg: "Invalid parameters" });
  }

  try {
    await prisma.$connect();
    const userTarget = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!userTarget) {
      prisma.$disconnect();
      return NextResponse.json({
        msg: "User not found ",
        status: 404,
      });
    }

    await prisma.$disconnect();

    return NextResponse.json({
      msg: "User found",
      userType: userTarget.userType,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    return NextResponse.json({
      error: error,
    });
  }
};

