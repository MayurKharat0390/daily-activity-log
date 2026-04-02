import { prisma } from "../../../lib/prisma";
import { dailyCommit, initializeStreakRepo } from "../../../lib/github";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export const dynamic = 'force-dynamic';

export async function GET() {
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
      if (!user.accounts || user.accounts.length === 0) {
        console.log(`Skipping ${user.email}: No GitHub account connected.`);
        continue;
      }
      
      const account = user.accounts[0];
      if (!account.access_token) {
        console.log(`Skipping ${user.email}: No access token found.`);
        continue;
      }

      try {
        // More robust owner/username lookup
        const octokit = new Octokit({ auth: account.access_token });
        const { data: githubUser } = await octokit.rest.users.getAuthenticated();
        const owner = githubUser.login;

        if (user.streakTarget === "DEDICATED") {
          console.log(`Pushing dedicated update for ${owner}...`);
          try {
            await dailyCommit(account.access_token, owner, "daily-streak-log");
            results.push({ user: user.email, status: "success", strategy: "DEDICATED" });
          } catch (err: any) {
             if (err.status === 404) {
               console.log(`Repo not found for ${owner}. Attempting auto-initialization...`);
               await initializeStreakRepo(account.access_token);
               // Retry once after initialization
               await dailyCommit(account.access_token, owner, "daily-streak-log");
               results.push({ user: user.email, status: "success (after init)", strategy: "DEDICATED" });
             } else {
               throw err;
             }
          }
        } else if (user.streakTarget === "RANDOM" && user.targetRepos) {
          try {
            const repositories = JSON.parse(user.targetRepos);
            if (Array.isArray(repositories) && repositories.length > 0) {
              const randomRepo = repositories[Math.floor(Math.random() * repositories.length)];
              console.log(`Pushing random update for ${owner} to ${randomRepo}...`);
              await dailyCommit(account.access_token, owner, randomRepo);
              results.push({ user: user.email, status: "success", strategy: "RANDOM", target: randomRepo });
            } else {
              console.log(`Skipping ${user.email}: RANDOM strategy selected but targetRepos list is empty.`);
            }
          } catch (e) {
             console.error(`JSON parse error for ${user.email} targetRepos:`, user.targetRepos);
             results.push({ user: user.email, status: "failed", error: "Invalid targetRepos JSON" });
          }
        }
      } catch (err: any) {
        console.error(`Failed Cron for ${user.email}:`, err.message);
        results.push({ user: user.email, status: "failed", error: err.message });
      }
    }

    console.log(`Cron finished. Processed ${results.length} streak updates.`);
    return NextResponse.json({ success: true, processed: results.length, results });

  } catch (error: any) {
    console.error("CRITICAL: Cron failed entirely", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
