import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { invitationId, status } = body;

    if (!invitationId || !status) {
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }

    if (status === "Rejected") {
      try {

        const invitation = await prisma.invitation.delete({
          where: { id: invitationId },
        });

        if (!invitation) {
          return NextResponse.json(
            {
              msg: "Unable to delete invitation",
            },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Error deleting invitation:", error);
        return NextResponse.json({
          msg: error,
          status: 500,
        });
      }
    }
    return NextResponse.json({
      msg: "Invitation deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      msg: error,
      status: 500,
    });
  }
};
