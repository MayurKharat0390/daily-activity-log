import { Octokit } from "octokit";

export async function initializeStreakRepo(token: string) {
  const octokit = new Octokit({ auth: token });
  
  // First, verify we are authenticated and get our username
  const { data: user } = await octokit.rest.users.getAuthenticated();
  
  const repoName = "daily-streak-log";
  
  try {
    // Check if repository already exists
    await octokit.rest.repos.get({
      owner: user.login,
      repo: repoName,
    });
    
    return { success: true, message: "Repository already exists." };
  } catch (error: any) {
    if (error.status === 404) {
      // Repository doesn't exist, create it!
      const { data: newRepo } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: "Automated daily activity log to maintain my GitHub streak",
        private: false, // Public to guarantee green squares visibility
        auto_init: true, // Automatically initializes with a README
      });
      
      return { success: true, message: "Repository created successfully.", repo: newRepo.html_url };
    }
    
    // Valid error from GitHub, throw it up
    throw new Error(`Failed to initialize repository: ${error.message}`);
  }
}

export async function dailyCommit(token: string, owner: string, repo: string) {
  const octokit = new Octokit({ auth: token });
  
  const path = "activity-log.txt";
  const dateStr = new Date().toISOString();
  let sha = undefined;
  
  // Try to get the file's current SHA if it exists so we can update it
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    
    if (!Array.isArray(fileData)) {
      sha = fileData.sha;
    }
  } catch (error: any) {
    // 404 indicates file doesn't exist yet, we can create it
    if (error.status !== 404) {
       console.error("Failed to check file", error);
    }
  }
  
  const content = `Streak update: ${dateStr}\n`;
  const encodedContent = Buffer.from(content).toString('base64');
  
  // Create or update the file
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Automated streak commit: ${dateStr.split('T')[0]}`,
    content: encodedContent,
    sha: sha,
    committer: {
      name: "Daily Streak Bot",
      email: "bot@dailystreak.test"
    }
  });
  
  return response.data;
}
