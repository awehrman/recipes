import { PrismaClient } from '@prisma/client';

import prisma from '../lib/prisma';

export type PrismaContext = {
  prisma: PrismaClient;
};

export async function createContext(): Promise<PrismaContext> {
  return {
    prisma
  };
}
