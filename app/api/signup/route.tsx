import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { username, email, password, userType } = body;
  await prisma.$connect();
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // await prisma.invitation.deleteMany();
    // await prisma.youTuber.deleteMany();
    await prisma.editor.deleteMany();
    // Now delete all records from the User table
    await prisma.user.deleteMany();
    // return NextResponse.json(
    //   {
    //     msg: "Email is already registered",
    //   },
    //   { status: 400 }
    // );
  }

  try {
    const userPassword = password;
    const finalPass = await bcrypt.hash(userPassword, 10);
    console.log("THE ENCRYPTID Passwordk : ", finalPass);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: finalPass,
        userType,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(
      {
        msg: "User Created",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
};
