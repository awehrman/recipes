import {
  EvernoteNotesMetaResponse,
  EvernoteNotesResponse,
  NoteMeta,
  NoteWithRelations
} from '@prisma/client';
import { AuthenticationError } from 'apollo-server-micro';

import { AppContext } from '../context';
import { fetchNotesMeta, fetchNotesContent } from './helpers/note';

import { isAuthenticated } from './helpers/evernote-session';
import { parseNotes } from './helpers/parser';

export const getNotesMeta = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesMetaResponse> => {
  console.log('[getNotesMeta]');
  // TODO dry up this auth error section
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

  const response: EvernoteNotesMetaResponse = {
    notes: []
  };

  try {
    const notes: NoteMeta[] = await fetchNotesMeta(ctx);
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

  const response: EvernoteNotesResponse = {
    notes: []
  };

  try {
    const notes: NoteWithRelations[] = await fetchNotesContent(ctx);
    response.notes = notes;
  } catch (err) {
    response.error = `${err}`;
  }
  console.log({ response });
  return response;
};

export const getParsedNotes = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesResponse> => {
  const { prisma, session } = ctx;
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

  const response: EvernoteNotesResponse = {
    notes: []
  };

  try {
    const notes = await parseNotes(prisma);
    response.notes = notes;
  } catch (err) {
    console.log({ err });
    response.error = `${err}`;
  }
  return response;
};

// const saveRecipe = async (
//   note: unknown,
//   prisma: PrismaClient,
//   importedUserId: number
// ): Promise<void> => {
//   const {
//     categories = [],
//     evernoteGUID,
//     tags = [],
//     title,
//     source,
//     image,
//     ingredients,
//     instructions
//   } = note;
//   // we'll eventually expand this to include a book reference and/or a url
//   // but we'll just throw strings in for the meantime
//   const sources = [];
//   if (source) {
//     sources.push(source);
//   }
//   await prisma.recipe.create({
//     data: {
//       importedUserId,
//       evernoteGUID,
//       title,
//       sources,
//       image,
//       categories: {
//         connect: categories
//       },
//       tags: {
//         connect: tags
//       },
//       IngredientLine: {
//         connect: ingredients
//       },
//       InstructionLine: {
//         connect: instructions
//       }
//     }
//   });
// };

// export const saveRecipes = async (
//   _root: unknown,
//   _args: unknown,
//   ctx: AppContext
// ): Promise<EvernoteResponse> => {
//   const response: EvernoteResponse = {};
//   const { prisma, req } = ctx;
//   const session: Session | null = await getSession({ req });
//   const user: SessionUserProps = session?.user || {};
//   const userId = Number(user.userId);

//   try {
//     // find all parsed notes
//     const notes = await prisma.note.findMany({
//       where: { isParsed: true },
//       select: {
//         id: true,
//         evernoteGUID: true,
//         title: true,
//         source: true,
//         image: true,
//         ingredients: {
//           select: {
//             id: true
//           }
//         },
//         instructions: {
//           select: {
//             id: true
//           }
//         },
//         categories: {
//           select: {
//             id: true
//           }
//         },
//         tags: {
//           select: {
//             id: true
//           }
//         }
//       }
//     });
//     const noteIds = notes.map((note) => note.id);

//     // create new recipes
//     await Promise.all(notes.map((note) => saveRecipe(note, prisma, userId)));

//     // remove notes
//     await prisma.note.deleteMany({
//       where: { id: { in: noteIds } }
//     });
//   } catch (err) {
//     response.error = `${err}`;
//   }
//   return response;
// };
