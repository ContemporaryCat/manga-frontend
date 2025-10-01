import NextAuth, { Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing environment variables for authentication");
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.name = token.name;
      session.user.image = token.picture;
      session.jwt = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }