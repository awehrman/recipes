import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Account, Profile, Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { CredentialInput } from 'next-auth/providers';
import GithubProvider from 'next-auth/providers/github';

import { getEvernoteSessionForUser } from '../../../graphql/resolvers/evernote-session';

import prisma from '../../../lib/prisma';

type SignInProps = {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: {
    verificationRequest?: boolean;
  };
  credentials?: Record<string, CredentialInput>;
};

type SessionProps = {
  session: Session;
  user: User | AdapterUser;
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
    async session({ session, user }: SessionProps): Promise<Session> {
      if (session?.user) {
        session.user = {
          ...session.user,
          ...user
        };

        // pull out an active evernote session if we have one
        const evernoteSession = await getEvernoteSessionForUser(
          null,
          { userId: user.id },
          { prisma }
        );

        session.user.evernote = evernoteSession;
      }
      return session;
    },
    async signIn({ user }: SignInProps): Promise<boolean> {
      console.log('signIn', { user });
      const { role } = user;
      const isAuthorized = role === 'SUPERADMIN' || role === 'ADMIN';

      if (isAuthorized) {
        return true;
      }
      return false;
    }
  }
};
export default NextAuth(authOptions);
