import {
  EvernoteNotesMetaResponse,
  EvernoteNotesResponse,
  NoteMeta,
  NoteWithRelations,
  PrismaClient,
  Recipe
} from '@prisma/client';
import { AuthenticationError } from 'apollo-server-micro';
import { performance } from 'perf_hooks';

import { AppContext } from '../context';
import {
  fetchNotesMeta,
  fetchNotesContent,
  fetchLocalNotesContent
} from './helpers/note';

import { isAuthenticated } from './helpers/evernote-session';

// TODO move this
const validateSession = (ctx: AppContext): void => {
  const { session } = ctx;
  if (!session) {
    throw new AuthenticationError('No evernote session available');
  }

  const {
    user: { evernote }
  } = session;
  const authenticated = isAuthenticated(evernote);

  if (!authenticated) {
    throw new AuthenticationError('Evernote is not authenticated');
  }
};

export const getNotesMeta = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesMetaResponse> => {
  console.log('[getNotesMeta]');
  validateSession(ctx);

  const response: EvernoteNotesMetaResponse = {
    notes: []
  };

  try {
    const t0 = performance.now();
    const notes: NoteMeta[] = await fetchNotesMeta(ctx);
    const t1 = performance.now();
    console.log(
      `[fetchNotesMeta] took ${((t1 - t0) / 1000).toFixed(2)} seconds.`
    );
    response.notes = notes;
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};

export const getNotesContent = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesResponse> => {
  console.log('[getNotesContent]');
  validateSession(ctx);

  const response: EvernoteNotesResponse = {
    notes: []
  };

  try {
    const t0 = performance.now();
    const notes: NoteWithRelations[] = await fetchNotesContent(ctx);
    const t1 = performance.now();
    console.log(
      `[fetchNotesContent] took ${((t1 - t0) / 1000).toFixed(2)} seconds.`
    );
    response.notes = notes;
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};

const saveRecipe = async (
  note: NoteWithRelations,
  prisma: PrismaClient,
  importedUserId: string
): Promise<Recipe | void> => {
  const {
    categories = [],
    evernoteGUID,
    tags = [],
    title,
    source,
    image,
    ingredients,
    instructions
  } = note;
  // we'll eventually expand this to include a book reference and/or a url
  // but we'll just throw strings in for the meantime
  const sources = [];
  if (source) {
    sources.push(source);
  }
  return prisma.recipe.create({
    data: {
      importedUserId,
      evernoteGUID,
      title,
      sources,
      image,
      categories: {
        connect: categories
      },
      tags: {
        connect: tags
      },
      ingredientLine: {
        connect: ingredients
      },
      instructionLine: {
        connect: instructions
      }
    }
  });
};

export const saveRecipes = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesResponse> => {
  console.log('[saveRecipes]');
  const { prisma, session } = ctx;
  validateSession(ctx);

  const response: EvernoteNotesResponse = {
    notes: []
  };

  try {
    const t0 = performance.now();
    // find all parsed notes
    const notes = await prisma.note.findMany({
      where: { isParsed: true },
      select: {
        id: true,
        evernoteGUID: true,
        title: true,
        source: true,
        image: true,
        ingredients: {
          select: {
            id: true
          }
        },
        instructions: {
          select: {
            id: true
          }
        },
        categories: {
          select: {
            id: true
          }
        },
        tags: {
          select: {
            id: true
          }
        }
      }
    });
    if (!notes.length) {
      throw new Error('No unparsed notes found!');
    }
    const noteIds = (notes ?? []).map((note) => note.id);
    // create new recipes
    if (session) {
      await Promise.all(
        notes.map((note) => saveRecipe(note, prisma, session.user.id))
      );
    }

    // remove notes
    await prisma.note.deleteMany({
      where: { id: { in: noteIds } }
    });
    const t1 = performance.now();
    console.log(`[saveRecipes] took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};

export const importLocal = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesResponse> => {
  console.log('[importLocal]');
  const { prisma, session } = ctx;
  // validateSession(ctx);

  const response: EvernoteNotesResponse = {
    notes: []
  };

  try {
    const t0 = performance.now();
    console.log('import the stuff...');
    const result = await fetchLocalNotesContent(ctx);
    // find all parsed notes
    // const notes = await prisma.note.findMany({
    //   where: { isParsed: true },
    //   select: {
    //     id: true,
    //     evernoteGUID: true,
    //     title: true,
    //     source: true,
    //     image: true,
    //     ingredients: {
    //       select: {
    //         id: true
    //       }
    //     },
    //     instructions: {
    //       select: {
    //         id: true
    //       }
    //     },
    //     categories: {
    //       select: {
    //         id: true
    //       }
    //     },
    //     tags: {
    //       select: {
    //         id: true
    //       }
    //     }
    //   }
    // });
    // if (!notes.length) {
    //   throw new Error('No unparsed notes found!');
    // }
    // const noteIds = (notes ?? []).map((note) => note.id);
    // // create new recipes
    // if (session) {
    //   await Promise.all(
    //     notes.map((note) => saveRecipe(note, prisma, session.user.id))
    //   );
    // }

    // // remove notes
    // await prisma.note.deleteMany({
    //   where: { id: { in: noteIds } }
    // });
    const t1 = performance.now();
    console.log(`[importLocal] took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};
