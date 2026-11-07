import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Liveness probe for the hosting platform.
 *
 * Intentionally does not touch the database: a cold Neon instance should not
 * make the platform think the app itself is down. Use `/api/health?db=1` if
 * you also want a connectivity check.
 */
export async function GET(request: Request) {
  const checkDb = new URL(request.url).searchParams.get("db") === "1";

  if (checkDb) {
    try {
      const { prisma } = await import("@/app/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      return NextResponse.json(
        {
          status: "error",
          database: "unreachable",
          message: error instanceof Error ? error.message : String(error),
        },
        { status: 503 }
      );
    }
  }

  return NextResponse.json({
    status: "ok",
    database: checkDb ? "ok" : "not-checked",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
