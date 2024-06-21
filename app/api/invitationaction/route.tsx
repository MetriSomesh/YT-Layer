import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { status, youtuberId, editorId, invitationId } = body;

    if (!status || !youtuberId || !editorId || !invitationId) {
      return NextResponse.json({ msg: "Unable to pass status", status: 400 });
    }

    if (status === "accepted") {
      try {
        const updatedEditor = await prisma.editor.update({
          where: { id: editorId },
          data: { youtuberId: youtuberId },
        });

        const updateInvitation = await prisma.invitation.update({
          where: { id: invitationId },
          data: { status: "accepted" },
        });

        if (!updatedEditor && !updateInvitation) {
          return NextResponse.json({
            msg: "Unable to update data into Table",
            status: 400,
          });
        }

        return NextResponse.json({
          msg: "Invitaion accepted",
          editor: updatedEditor,
          invitation: updateInvitation,
          status: 200,
        });
      } catch (error) {
        console.error("Error updating editor:", error);
        return NextResponse.json({
          msg: "Failed to accept invitation",
          status: 500,
        });
      }
    } else if (status === "rejected") {
      try {
        const updateInvitation = await prisma.invitation.delete({
          where: { id: invitationId },
        });

        return NextResponse.json({
          msg: "Invitaion rejected",

          invitation: updateInvitation,
          status: 200,
        });
      } catch (error) {
        console.error("Error updating editor:", error);
        return NextResponse.json({
          msg: "Failed to accept invitation",
          status: 500,
        });
      }
    } else {
      return NextResponse.json({ msg: "Invalid status", status: 400 });
    }
  } catch (error) {
    console.error("Error updating editor:", error);
    return NextResponse.json({
      msg: "Failed to accept invitation",
      status: 500,
    });
  }
};