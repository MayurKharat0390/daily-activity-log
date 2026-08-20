import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { followDeveloper } from "./lib/github"
import type { User } from "@auth/core/types"

interface ExtendedUser extends User {
  streakTarget?: string;
  targetRepos?: string;
  githubUsername?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
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
        const ext = user as ExtendedUser;
        // @ts-expect-error -- custom field not in default session type
        session.user.streakTarget = ext.streakTarget;
        // @ts-expect-error -- custom field not in default session type
        session.user.targetRepos = ext.targetRepos;
        // @ts-expect-error -- custom field not in default session type
        session.user.githubUsername = ext.githubUsername;
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const ext = user as ExtendedUser;
        if (profile?.login && profile.login !== ext.githubUsername) {
          await prisma.user.update({
            where: { id: user.id },
            data: { githubUsername: profile.login as string }
          })
        }
        
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
