import { Session } from 'next-auth';
import { PrismaClient } from '@prisma/client';

export type PrismaContext = {
  prisma: PrismaClient;
  session: Session | null;
};
