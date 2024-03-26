import { EvernoteSession } from '@prisma/client';
import { AppContext } from '../context';

import { getDefaultEvernoteSessionResponse } from './helpers/evernote-session';

type ResetDatabaseArgs = {
  userId: string;
};

export const resetDatabase = async (
  _root: unknown,
  args: ResetDatabaseArgs,
  ctx: AppContext
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

type EmptyArgs = {};

export const resetParserRules = async (
  _root: unknown,
  args: EmptyArgs,
  ctx: AppContext
): Promise<GenericResponse> => {
  const { prisma } = ctx;
  const response: GenericResponse = {};

  try {
    // TODO
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};

export const seedBasicParserRules = async (
  _root: unknown,
  args: EmptyArgs,
  ctx: AppContext
): Promise<GenericResponse> => {
  const { prisma } = ctx;
  const { userId } = args;
  const response: GenericResponse = {};

  try {
    // TODO
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};
