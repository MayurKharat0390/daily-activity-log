import { auth } from "../../../../auth";
import { unlockPullShark, unlockPairExtraordinaire, unlockQuickdraw, unlockYolo } from "../../../../lib/badges";
import { NextResponse } from "next/server";

export const maxDuration = 30;


export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();
    
    // Fetch user access token
    const { prisma } = await import("../../../../lib/prisma");
    const account = await prisma.account.findFirst({
        where: { userId: session.user.id, provider: "github" }
    });

    if (!account || !account.access_token) {
        return NextResponse.json({ error: "Missing GitHub token" }, { status: 400 });
    }

    let result = { success: false };

    switch(type) {
        case "SHARK": result = await unlockPullShark(account.access_token); break;
        case "PAIR": result = await unlockPairExtraordinaire(account.access_token); break;
        case "QUICK": result = await unlockQuickdraw(account.access_token); break;
        case "YOLO": result = await unlockYolo(account.access_token); break;
        default: return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Unlock error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
