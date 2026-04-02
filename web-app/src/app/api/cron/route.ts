import { prisma } from "../../../lib/prisma";
import { dailyCommit, initializeStreakRepo } from "../../../lib/github";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Security: Check for Cron Secret if configured
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting daily automation cron...");
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          where: { provider: "github" }
        }
      }
    });

    const results = [];

    for (const user of users) {
      if (!user.accounts || user.accounts.length === 0) continue;
      
      const account = user.accounts[0];
      if (!account.access_token) continue;

      try {
        const octokit = new Octokit({ auth: account.access_token });
        const { data: githubUser } = await octokit.rest.users.getAuthenticated();
        const owner = githubUser.login;

        let success = false;
        let strategyUsed = user.streakTarget || "DEDICATED";
        let targetRepoUsed = "";

        if (user.streakTarget === "DEDICATED") {
          try {
            await dailyCommit(account.access_token, owner, "daily-streak-log");
            success = true;
            targetRepoUsed = "portfolio-core-engine";
          } catch (err: any) {
             if (err.status === 404) {
               await initializeStreakRepo(account.access_token);
               await dailyCommit(account.access_token, owner, "daily-streak-log");
               success = true;
               targetRepoUsed = "portfolio-core-engine";
             } else {
               throw err;
             }
          }
        } else if (user.streakTarget === "RANDOM" && user.targetRepos) {
          const repositories = JSON.parse(user.targetRepos);
          if (Array.isArray(repositories) && repositories.length > 0) {
            const randomRepo = repositories[Math.floor(Math.random() * repositories.length)];
            await dailyCommit(account.access_token, owner, randomRepo);
            success = true;
            targetRepoUsed = randomRepo;
          }
        }

        if (success) {
            // Update User Analytics
            await prisma.user.update({
                where: { id: user.id },
                // @ts-ignore
                data: {
                    lastRunAt: new Date(),
                    streakCount: { increment: 1 }
                }
            });
            results.push({ user: user.email, status: "success", strategy: strategyUsed, target: targetRepoUsed });
        }
      } catch (err: any) {
        console.error(`Failed Cron for ${user.email}:`, err.message);
        results.push({ user: user.email, status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });

  } catch (error: any) {
    console.error("CRITICAL: Cron failed entirely", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
