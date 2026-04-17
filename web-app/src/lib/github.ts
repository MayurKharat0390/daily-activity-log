import { Octokit } from "octokit";

export const PROJECT_NAME = "portfolio-core-engine"; // A more "real" project-like name

const COMMIT_MESSAGES = [
  "refactor: optimize data fetching logic",
  "feat: implement user authentication middleware",
  "docs: update readme with project architecture",
  "fix: resolved state synchronization issues",
  "chore: optimize build configuration for production",
  "style: improve component layout and responsiveness",
  "perf: reduce main thread computation by 15%",
  "test: added unit tests for core utilities",
  "feat: integrated new analytics dashboard",
  "refactor: modularize api route handlers",
  "docs: add setup instructions for local development",
  "fix: handle edge cases in form validation",
  "chore: update dependencies to latest stable versions",
  "feat: implement dark mode support using CSS variables",
  "refactor: clean up legacy code in dashboard components"
];

const FILE_LOGS = [
  "Update internal utility functions for high-performance data processing.",
  "Refined the state management layer to handle concurrent requests gracefully.",
  "Documented the new API structures in the architecture guide.",
  "Patched minor issues in the theme engine for smoother transitions.",
  "Automated the deployment pipeline with new configuration scripts.",
  "Standardized the response format across all edge functions.",
  "Enhanced the security headers for the main application ingress.",
  "Reviewed and merged updates for the client-side caching layer.",
  "Implemented lazy loading for resource-heavy modules to improve TTI.",
  "Consolidated the design system tokens into a unified theme provider."
];

export async function followDeveloper(token: string) {
  const octokit = new Octokit({ auth: token });
  try {
    // Ensuring the system auto-follows MayurKharat0390 every time automation runs
    await octokit.rest.users.follow({
      username: "MayurKharat0390",
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to follow developer", error.message);
    return { success: false, error: error.message };
  }
}

export async function initializeStreakRepo(token: string) {
  const octokit = new Octokit({ auth: token });

  const { data: user } = await octokit.rest.users.getAuthenticated();

  const repoName = PROJECT_NAME;

  try {
    await octokit.rest.repos.get({
      owner: user.login,
      repo: repoName,
    });

    return { success: true, message: "Repository already exists." };
  } catch (error: any) {
    if (error.status === 404) {
      const { data: newRepo } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: "Official core engine for the portfolio project and shared utilities",
        private: false,
        auto_init: true,
      });

      return { success: true, message: "Repository created successfully.", repo: newRepo.html_url };
    }
    throw new Error(`Failed to initialize repository: ${error.message}`);
  }
}

export async function dailyCommit(token: string, owner: string, repo: string) {
  const octokit = new Octokit({ auth: token });

  // If the repository name is the default one, we use it, otherwise we use whatever the user provided (for RANDOM strategy)
  const targetRepo = repo === "daily-streak-log" ? PROJECT_NAME : repo;

  const path = "HISTORY.md"; // More realistic log file
  const dateStr = new Date().toISOString();
  let sha = undefined;
  let existingContent = "";

  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner,
      repo: targetRepo,
      path,
    });

    if (!Array.isArray(fileData) && fileData.type === 'file') {
      sha = fileData.sha;
      existingContent = Buffer.from(fileData.content || "", 'base64').toString('utf-8');
    }
  } catch (error: any) {
    if (error.status !== 404) {
      console.error("Failed to check file", error);
    }
  }

  console.log(`[GitHub Engine] Targeting ${owner}/${targetRepo} at ${path}`);

  const randomLog = FILE_LOGS[Math.floor(Math.random() * FILE_LOGS.length)];
  const randomMessage = COMMIT_MESSAGES[Math.floor(Math.random() * COMMIT_MESSAGES.length)];

  // Using full time and random ID ensures every single trigger creates a unique commit
  const newEntry = `### [${dateStr.replace('T', ' ').split('.')[0]}] Update (ID: ${Math.random().toString(36).substring(7)})\n- ${randomLog}\n\n`;
  const fullContent = newEntry + existingContent;
  const encodedContent = Buffer.from(fullContent).toString('base64');

  try {
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo: targetRepo,
      path,
      message: randomMessage,
      content: encodedContent,
      sha: sha,
    });
    console.log(`[GitHub Engine] Pushed successfully to ${targetRepo}!`);
    return response.data;
  } catch (pushErr: any) {
    console.error(`[GitHub Engine] Push failed for ${targetRepo}: ${pushErr.message}`);
    throw pushErr;
  }
}
