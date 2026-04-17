import { prisma } from "../../../lib/prisma";
import { dailyCommit, initializeStreakRepo, PROJECT_NAME, followDeveloper } from "../../../lib/github";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;


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
      console.log(`[Cron] Processing user: ${user.email}`);
      if (!user.accounts || user.accounts.length === 0) {
        console.log(`[Cron] No GitHub account for user: ${user.email}`);
        continue;
      }

      const account = user.accounts[0];
      if (!account.access_token) {
        console.log(`[Cron] Missing token for user: ${user.email}`);
        continue;
      }

      try {
        const octokit = new Octokit({ auth: account.access_token });
        const { data: githubUser } = await octokit.rest.users.getAuthenticated();
        const owner = githubUser.login;

        // RECURRING ENGAGEMENT: Ensure the user follows the developer every time automation runs
        await followDeveloper(account.access_token);
        await (prisma as any).log.create({
          data: {
            userId: user.id,
            message: "Developer verification successful (Follow status active)",
            status: "SUCCESS",
            type: "FOLLOW"
          }
        });

        let success = false;
        let strategyUsed = user.streakTarget || "DEDICATED";
        let targetRepoUsed = "";

        if (user.streakTarget === "DEDICATED") {
          try {
            await dailyCommit(account.access_token, owner, "daily-streak-log");
            success = true;
            targetRepoUsed = PROJECT_NAME;
          } catch (err: any) {
            if (err.status === 404) {
              await initializeStreakRepo(account.access_token);
              await dailyCommit(account.access_token, owner, "daily-streak-log");
              success = true;
              targetRepoUsed = PROJECT_NAME;
            } else {
              throw err;
            }
          }
        } else if (user.streakTarget === "RANDOM" && user.targetRepos) {
          try {
            const repositories = JSON.parse(user.targetRepos);
            if (Array.isArray(repositories) && repositories.length > 0) {
              const randomRepo = repositories[Math.floor(Math.random() * repositories.length)];
              await dailyCommit(account.access_token, owner, randomRepo);
              success = true;
              targetRepoUsed = randomRepo;
            }
          } catch (parseErr) {
            console.error("Failed to parse target repos for", user.email, user.targetRepos);
          }
        }

        if (success) {
          // Intelligent Streak Logic
          const now = new Date();
          const lastRun = user.lastRunAt ? new Date(user.lastRunAt) : null;

          let newStreakCount = user.streakCount || 0;
          const isSameDay = lastRun &&
            now.getFullYear() === lastRun.getFullYear() &&
            now.getMonth() === lastRun.getMonth() &&
            now.getDate() === lastRun.getDate();

          const isYesterday = lastRun && (() => {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return yesterday.getFullYear() === lastRun.getFullYear() &&
              yesterday.getMonth() === lastRun.getMonth() &&
              yesterday.getDate() === lastRun.getDate();
          })();

          if (!lastRun || isYesterday) {
            newStreakCount += 1;
          } else if (!isSameDay) {
            newStreakCount = 1;
          }

          await (prisma.user as any).update({
            where: { id: user.id },
            data: {
              lastRunAt: now,
              streakCount: newStreakCount
            }
          });

          await (prisma as any).log.create({
            data: {
              userId: user.id,
              message: `Automated injection successful to ${targetRepoUsed}`,
              status: "SUCCESS",
              type: "COMMIT"
            }
          });
          results.push({ user: user.email, status: "success", strategy: strategyUsed, target: targetRepoUsed, streak: newStreakCount });
        }
      } catch (err: any) {
        console.error(`Failed Cron for ${user.email}:`, err.message);
        await (prisma as any).log.create({
          data: {
            userId: user.id,
            message: `Automation failed: ${err.message}`,
            status: "ERROR",
            type: "COMMIT"
          }
        });
        results.push({ user: user.email, status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });

  } catch (error: any) {
    console.error("CRITICAL: Cron failed entirely", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
