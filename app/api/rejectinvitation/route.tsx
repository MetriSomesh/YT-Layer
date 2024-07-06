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

    if (status === "rejected") {
      try {
        await prisma.$connect();

        const invitation = await prisma.invitation.delete({
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
      } catch (error) {
        await prisma.$disconnect();
        console.error("Error deleting invitation:", error);
        return NextResponse.json({
          msg: error,
          status: 500,
        });
      }
    }
    await prisma.$disconnect();
    return NextResponse.json({
      msg: "Invitation deleted successfully",
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error(error);
    return NextResponse.json({
      msg: error,
      status: 500,
    });
  }
};
