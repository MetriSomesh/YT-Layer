import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const tokens = body.tokens;
  const email = body.email;
  const accessToken = tokens.accessToken;
  const expiryDate = tokens.expiry_date;
  const userEmail = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  const youtuberCred = await prisma.youTuber.create({
    data: {
      user: { connect: { id: userEmail?.id } },
      accessToken: accessToken,
      refreshToken: expiryDate,
    },
  });

  if (youtuberCred) {
    return NextResponse.json({
      msg: "Done",
    });
  } else {
    return NextResponse.json({
      msg: "Failsed",
    });
  }
};
