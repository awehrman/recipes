import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Account, Profile, Session, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { CredentialInput } from 'next-auth/providers';
import GithubProvider from 'next-auth/providers/github';
import type { JWT } from 'next-auth/jwt';

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
  token: JWT;
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
        // save some user information into our session
        session.user.noteImportOffset = user?.noteImportOffset ?? 0;
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }: SignInProps): Promise<boolean> {
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
