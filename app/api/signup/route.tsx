import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { username, email, password, userType } = body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({
      msg: "Email is Already Register",
    });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        userType,
      },
    });

    return NextResponse.json({
      msg: "User Created",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Internal Server Error",
    });
  }
};
