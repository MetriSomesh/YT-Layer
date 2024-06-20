import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { youtuberId, editorId, message } = body;
    var { status } = body;

    if (!youtuberId || !editorId || !message) {
      return NextResponse.json({ msg: "Fill all the fields" }, { status: 500 });
    }

    if (!status) {
      status = "pending";
    }

    const invitation = await prisma.invitation.create({
      data: {
        youtuber: {
          connect: { id: youtuberId },
        },
        editor: {
          connect: { id: editorId },
        },
        message,
        status,
      },
      include: {
        youtuber: true,
        editor: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { msg: "Failed to create invitation instatnce" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      msg: "Invitation is created sucessfully",
      invitation: invitation,
    });
  } catch (error) {
    console.error("Error creating invitation :", error);
    return NextResponse.json(
      {
        msg: "Faild to create invitation",
      },
      { status: 500 }
    );
  }
};
