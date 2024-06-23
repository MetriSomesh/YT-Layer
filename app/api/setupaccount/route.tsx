import { PrismaClient, UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData = await req.formData();

  try {
    const email = formData.get("email") as string;
    if (!email) {
      return NextResponse.json(
        {
          msg: "Failed to get email address",
        },
        { status: 400 }
      );
    }
    await prisma.$connect();
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        editor: true,
      },
    });

    console.log(user);

    if (!user) {
      await prisma.$disconnect();
      return NextResponse.json(
        {
          msg: "Failed to get user info",
        },
        { status: 404 }
      );
    }

    const profilePicture = formData.get("profilePicture") as string;
    const description = formData.get("description") as string;
    const experience = formData.get("experience") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const city = formData.get("city") as string;

    const newEditor = await prisma.editor.create({
      data: {
        profile_pic: profilePicture,
        description: description,
        experience: experience,
        phone_number: phoneNumber,
        country: country,
        state: state,
        city: city,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(
      {
        msg: "Editor profile created successfully",
        editor: newEditor,
      },
      { status: 201 }
    );
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error creating editor profile:", error);
    return NextResponse.json(
      {
        msg: "Failed to create editor profile",
      },
      { status: 500 }
    );
  }
};
