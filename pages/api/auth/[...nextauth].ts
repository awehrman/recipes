import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';

import prisma from '../../../lib/prisma';

type UserProps = {
  id: string;
  role?: string;
};

type SessionProps = {
  session: Session;
  token: JWT;
  user: UserProps;
};

type SignInProps = {
  user: UserProps;
};

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: `${process.env.NEXT_PUBLIC_GITHUB_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GITHUB_SECRET}`
    })
  ],
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session }: SessionProps): Promise<Session> {
      // console.log('session', { session, token, user });
      if (!session?.user) {
        return session;
      }

      // for whatever reason these don't always populate client side
      // session.user.evernoteAuthToken = token.evernoteAuthToken;
      // session.user.evernoteReqToken = token.evernoteReqToken;
      // session.user.evernoteReqSecret = token.evernoteReqSecret;
      // session.user.evernoteExpiration = token.evernoteExpiration;
      // session.user.noteImportOffset = token?.noteImportOffset || 0;
      // session.user.userId = token.id;
      return session;
    },
    async signIn({ user }: SignInProps): Promise<boolean> {
      console.log('signIn', { user });
      const { role } = user;
      const isAllowedToSignIn = role === 'SUPERADMIN';
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  }
};
export default NextAuth(authOptions);
