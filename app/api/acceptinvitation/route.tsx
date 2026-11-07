import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { invitationId, status } = body;

    if (!invitationId || !status) {
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }

    if (status === "Accepted") {
      try {
      

        const invitation = await prisma.invitation.findUnique({
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
        if (invitation.editorId && invitation.youtuberId) {
          const updateEditor = await prisma.editor.update({
            where: { id: invitation.editorId },
            data: {
              youtuberId: invitation.youtuberId,
            },
          });

          if (!updateEditor) {
            return NextResponse.json(
              {
                msg: "Unable to update editor data",
              },
              { status: 500 }
            );
          }
          const updateYoutuber = await prisma.youTuber.update({
            where: { id: invitation.youtuberId },
            data: {
              editor: { connect: { id: invitation.editorId } },
            },
          });

          if (!updateYoutuber) {
            return NextResponse.json(
              {
                msg: "Unable to update youtuber data",
              },
              { status: 500 }
            );
          }
          const deleteInvitation = await prisma.invitation.delete({
            where: { id: invitationId },
          });

          if (!deleteInvitation) {
            return NextResponse.json(
              {
                msg: "Error deleting invitation",
              },
              {
                status: 500,
              }
            );
          }
        }
        return NextResponse.json({
          msg: "Invitation accepted successfully",
        });
      } catch (error) {
        console.error("Error performing operations:", error);
        return NextResponse.json({
          msg: error,
          status: 500,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      msg: error,
      status: 500,
    });
  }
};
