import { Role, User } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next/auth';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }

  interface User {
    id: string;
    noteImportOffset?: number;
    role: Role;
    evernoteSession: EvernoteSession[];
  }
}

type EvernoteSession = {
  id: string;
  expires?: string;

  authURL?: string;
  oauthVerifier?: string;
  error?: string;
  loading: boolean;

  evernoteAuthToken?: string;
  evernoteReqToken?: string;
  evernoteReqSecret?: string;

  user: User;
  userId: string;
};

enum Role {
  USER,
  ADMIN,
  SUPERADMIN
}
