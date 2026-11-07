import { UserType } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { username, email, password, userType } = body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      {
        msg: "Email is already registered",
      },
      { status: 409 }
    );
  }

  try {
    const finalPass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: finalPass,
        userType,
      },
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
      },
    });
    return NextResponse.json(
      {
        msg: "User Created",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
};
