import { Role } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next/auth';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }

  interface User {
    id?: string;
    evernoteAuthToken?: string;
    evernoteExpiration?: string;
    evernoteReqToken?: string;
    evernoteReqSecret?: string;
    noteImportOffset?: number;
    role: Role;
  }
}

enum Role {
  USER,
  ADMIN,
  SUPERADMIN
}
