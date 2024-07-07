import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    await prisma.$connect();
    const body = await req.json();
    const { invitationId, status } = body;

    if (!invitationId || !status) {
      await prisma.$disconnect();
      return NextResponse.json({ msg: "Bad request", status: 400 });
    }

    if (status === "Accepted") {
      try {
        await prisma.$connect();

        const invitation = await prisma.invitation.findUnique({
          where: { id: invitationId },
        });

        if (!invitation) {
          await prisma.$disconnect();
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
            await prisma.$disconnect();
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
            await prisma.$disconnect();
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
            await prisma.$disconnect();
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
        await prisma.$disconnect();
        return NextResponse.json({
          msg: "Invitation accepted successfully",
        });
      } catch (error) {
        await prisma.$disconnect();
        console.error("Error performing operations:", error);
        return NextResponse.json({
          msg: error,
          status: 500,
        });
      }
    }
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    return NextResponse.json({
      msg: error,
      status: 500,
    });
  }
};
