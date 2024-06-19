import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { editorId } = body;

  if (!editorId) {
    return NextResponse.json({ msg: "Invalid request", status: 400 });
  }
  try {
    const Isinvitation = await prisma.editor.findUnique({
      where: { id: editorId },
      include: { invitation: true },
    });

    if (!Isinvitation) {
      return NextResponse.json({ msg: "Invitation not found ", status: 404 });
    }

    return NextResponse.json({
      msg: "Invitation Found",
      invitation: Isinvitation,
    });
  } catch (error) {
    console.error("Error updating editor:", error);
    return NextResponse.json({
      msg: "Failed to accept invitation",
      status: 500,
    });
  }
};
