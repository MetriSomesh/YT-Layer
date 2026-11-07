import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { editorId } = body;

  if (!editorId) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        editorId: editorId,
        viewed: false,
      },
      include: {
        channel: true,
      },
    });


    if (invitations.length === 0) {
      return NextResponse.json({ msg: "No new invitations" }, { status: 201 });
    }

    return NextResponse.json(
      {
        msg: "Invitation Found",
        invitation: invitations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking invitation:", error);
    return NextResponse.json(
      {
        msg: "Failed to check invitation",
      },
      { status: 500 }
    );
  }
};
