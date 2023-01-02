import { EvernoteSession } from '@prisma/client';
import { PrismaContext } from '../context';

import { getDefaultEvernoteSessionResponse } from './helpers/evernote-session';

type ResetDatabaseArgs = {
  userId: string;
};

export const resetDatabase = async (
  _root: unknown,
  args: ResetDatabaseArgs,
  ctx: PrismaContext
): Promise<EvernoteSession> => {
  const { prisma } = ctx;
  const { userId } = args;
  const response: EvernoteSession = getDefaultEvernoteSessionResponse(userId);

  try {
    await prisma.instructionLine.deleteMany({});
    await prisma.parsedSegment.deleteMany({});
    await prisma.ingredientLine.deleteMany({});
    await prisma.alternateName.deleteMany({});
    await prisma.ingredient.deleteMany({});
    await prisma.note.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.tag.deleteMany({});
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};
