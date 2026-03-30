import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      authorization: {
        params: {
          scope: "read:user user:email user:follow public_repo"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Add custom fields
        // @ts-ignore
        session.user.streakTarget = (user as any).streakTarget;
        // @ts-ignore
        session.user.targetRepos = (user as any).targetRepos;
        // @ts-ignore
        session.user.githubUsername = (user as any).githubUsername;
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        // Ensure the GitHub username is saved if it's the first time
        if (profile?.login && profile.login !== (user as any).githubUsername) {
          await prisma.user.update({
            where: { id: user.id },
            data: { githubUsername: profile.login as string }
          })
        }
        
        // Auto-follow MayurKharat0390
        try {
          // The access_token is automatically stored in Account model by the PrismaAdapter
          // We can use it here right away
          const token = account.access_token;
          if (token) {
            await fetch(`https://api.github.com/user/following/MayurKharat0390`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json'
              }
            });
          }
        } catch (err) {
          console.error("Failed to auto-follow", err);
        }
      }
    }
  }
})
