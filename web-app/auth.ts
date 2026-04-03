import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./src/lib/prisma"

import { followDeveloper } from "./src/lib/github"

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
          const token = account.access_token;
          if (token) {
            await followDeveloper(token);
          }
        } catch (err) {
          console.error("Failed to auto-follow", err);
        }
      }
    }
  }
})
