// utils/getUserId.ts
import { NextRequest } from "next/server";
import { getServerSession } from "./getServerSession";

export async function getUserId(req: NextRequest) {
  const session = await getServerSession(req);

  if (session && session.sub) {
    return session.sub;
  }

  return null;
}
