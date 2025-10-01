import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing environment variables for authentication");
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      // Auth.js v5 does not directly expose `session.jwt` like v4.
      // If you need the JWT in the session, you might need to add it explicitly
      // or rely on the `token` object directly in server-side contexts.
      // For now, I'll remove the direct assignment to avoid potential type issues.
      // session.jwt = token;
      return session;
    },
  },
})