import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const account = await prisma.account.findFirst({
        where: { userId: userId, provider: "github" }
    });

    if (!account || !account.access_token) {
        return NextResponse.json({ error: "Missing GitHub token" }, { status: 400 });
    }

    const octokit = new Octokit({ auth: account.access_token });
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 50,
        sort: "updated",
        direction: "desc",
        visibility: "public"
    });

    return NextResponse.json({ 
        repos: repos.map(r => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name
        }))
    });
  } catch (err: any) {
    console.error("Failed to fetch repos", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
