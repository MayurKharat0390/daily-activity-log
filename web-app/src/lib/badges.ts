import { Octokit } from "octokit";
import { PROJECT_NAME } from "./github";

export async function unlockPullShark(token: string) {
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.rest.users.getAuthenticated();
  const owner = user.login;
  const repo = PROJECT_NAME;

  try {
    const { data: mainBranch } = await octokit.rest.repos.getBranch({ owner, repo, branch: 'main' });
    const branchName = `feature-shark-${Math.floor(Math.random() * 10000)}`;
    await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: mainBranch.commit.sha });

    const content = Buffer.from(`# Achievement Unlocked\nInitiated at ${new Date().toISOString()}`).toString('base64');
    await octokit.rest.repos.createOrUpdateFileContents({
      owner, repo, path: `SHARK-${Math.floor(Math.random() * 1000)}.md`,
      message: "feat: add shark achievement log", content, branch: branchName,
    });

    const { data: pr } = await octokit.rest.pulls.create({
      owner, repo, title: "🦈 Shark Achievement Pulse",
      head: branchName, base: 'main', body: "Automated PR to fulfill 'Pull Shark' badge.",
    });

    await octokit.rest.pulls.merge({ owner, repo, pull_number: pr.number, merge_method: 'squash' });
    return { success: true };
  } catch (error: any) {
    throw error;
  }
}

export async function unlockPairExtraordinaire(token: string) {
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.rest.users.getAuthenticated();
  const owner = user.login;
  const repo = PROJECT_NAME;

  try {
    const { data: mainBranch } = await octokit.rest.repos.getBranch({ owner, repo, branch: 'main' });
    const branchName = `feature-pair-${Math.floor(Math.random() * 10000)}`;
    await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: mainBranch.commit.sha });

    const content = Buffer.from(`# Collaborative Achievement\nCreated at ${new Date().toISOString()}`).toString('base64');
    const message = `feat: pair programming update\n\nCo-authored-by: MayurKharat0390 <mayurkharat2006@gmail.com>`;
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner, repo, path: `PAIR-${Math.floor(Math.random() * 1000)}.md`,
      message, content, branch: branchName,
    });

    const { data: pr } = await octokit.rest.pulls.create({
      owner, repo, title: "🤝 Pair Programming Session",
      head: branchName, base: 'main', body: "Automated PR for 'Pair Extraordinaire' badge.",
    });

    await octokit.rest.pulls.merge({ owner, repo, pull_number: pr.number });
    return { success: true };
  } catch (error: any) {
    throw error;
  }
}

export async function unlockQuickdraw(token: string) {
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const owner = user.login;
    const repo = PROJECT_NAME;

    try {
        // 1. Create an issue
        const { data: issue } = await octokit.rest.issues.create({
            owner,
            repo,
            title: "Performance degradation in core engine",
            body: "The system is experiencing minor latency issues. Investigation required."
        });

        // 2. Immediately close it with a commit reference
        const content = Buffer.from(`# Resolved Task\nFix for issue #${issue.number}`).toString('base64');
        
        await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: `QUICK-${issue.number}.md`,
          message: `fix: resolved issue #${issue.number}`,
          content,
          branch: 'main'
        });

        // 3. Mark as closed
        await octokit.rest.issues.update({
            owner,
            repo,
            issue_number: issue.number,
            state: 'closed',
            state_reason: 'completed'
        });

        return { success: true };
    } catch (error: any) {
        throw error;
    }
}

export async function unlockYolo(token: string) {
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const owner = user.login;
    const repo = PROJECT_NAME;

    try {
        // YOLO requires merging a PR without reviews
        const { data: mainBranch } = await octokit.rest.repos.getBranch({ owner, repo, branch: 'main' });
        const branchName = `yolo-patch-${Math.floor(Math.random() * 10000)}`;
        await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: mainBranch.commit.sha });

        const content = Buffer.from(`# YOLO Merge\nMerge without review at ${new Date().toISOString()}`).toString('base64');
        await octokit.rest.repos.createOrUpdateFileContents({
          owner, repo, path: `YOLO-${Math.floor(Math.random() * 1000)}.md`,
          message: "fix: bypass verification for high-speed deployment", content, branch: branchName,
        });

        const { data: pr } = await octokit.rest.pulls.create({
          owner, repo, title: "🚀 YOLO Deployment Drive",
          head: branchName, base: 'main', body: "Deployment merged instantly without external review for the 'YOLO' badge.",
        });

        // Merging immediately is the "YOLO" way
        await octokit.rest.pulls.merge({ owner, repo, pull_number: pr.number });
        return { success: true };
    } catch (error: any) {
        throw error;
    }
}
