import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { initializeStreakRepo } from "@/lib/github";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Parse the body
    const body = await request.json();
    const strategy = body.strategy || "DEDICATED";
    
    // Convert targetRepos comma separated string to JSON array
    let parsedTargetRepos: string[] = [];
    if (body.targetRepos) {
      parsedTargetRepos = body.targetRepos.split(',').map((repo: string) => repo.trim()).filter(Boolean);
    }

    // Grab user account to get the token
    const account = await prisma.account.findFirst({
      where: { userId: userId, provider: "github" }
    });

    if (!account || !account.access_token) {
      return NextResponse.json({ error: "Missing GitHub token" }, { status: 400 });
    }

    if (strategy === "DEDICATED") {
      // Create the repository via GitHub API
      await initializeStreakRepo(account.access_token);
    }

    // Save the preference to DB
    await prisma.user.update({
      where: { id: userId },
      data: { 
        streakTarget: strategy,
        targetRepos: parsedTargetRepos.length > 0 ? JSON.stringify(parsedTargetRepos) : null
      }
    });

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 });
  }
}
