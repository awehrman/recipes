import { PrismaClient } from '@prisma/client';
import Evernote from 'evernote';
import { Session } from 'next-auth';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
  session: DeepMockProxy<Session | null>;
  evernote: DeepMockProxy<Evernote.Client>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    session: mockDeep<Session | null>(),
    evernote: mockDeep<Evernote.Client>()
  };
};
