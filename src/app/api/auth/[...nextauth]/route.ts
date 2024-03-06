import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    })
  ],
  callbacks : {
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({session, token}) {
      session.user.accessToken = token.accessToken as string;
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}