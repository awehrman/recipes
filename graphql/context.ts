import { PrismaClient } from '@prisma/client';
import Evernote from 'evernote';
import { Session } from 'next-auth';

export type AppContext = {
  prisma: PrismaClient;
  session: Session | null;
  evernoteClient: Evernote.Client;
};
