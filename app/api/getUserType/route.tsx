import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ msg: "Invalid parameters" });
  }

  try {
    const userTarget = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!userTarget) {
      return NextResponse.json({
        msg: "User not found ",
        status: 404,
      });
    }


    return NextResponse.json({
      msg: "User found",
      userType: userTarget.userType.toString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error,
    });
  }
};
