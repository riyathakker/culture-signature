import type { NextAuthConfig } from "next-auth";


export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.mobileNo = (user as any).mobileNo;
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.mobileNo) token.mobileNo = session.mobileNo;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).mobileNo = token.mobileNo;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
