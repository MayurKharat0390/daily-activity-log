import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.log.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return NextResponse.json({ logs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to fetch logs", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
