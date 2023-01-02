import { Note, PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server-micro';

import { PrismaContext } from '../context';
import { fetchNotesMeta } from './helpers/note';

import { isAuthenticated } from './helpers/evernote-session';

type NoteMeta = {
  id?: string;
  evernoteGUID?: string;
  title?: string;
  source?: string;
  image?: string;
  // tags {
  //   id
  //   name
  // }
  // categories {
  //   id
  //   name
  // }
};

type EvernoteNotesResponse = {
  error?: string;
  notes?: NoteMeta[];
};

export const getNotesMeta = async (
  _root: unknown,
  _args: unknown,
  ctx: PrismaContext
): Promise<EvernoteNotesResponse> => {
  console.log('getNotesMeta - resolvers');
  const { session } = ctx;
  if (!session) {
    throw new Error('No session available'); // TODO make this a nicer error
  }

  const {
    user: { evernote }
  } = session;
  const authenticated = isAuthenticated(evernote);

  if (!authenticated) {
    throw new AuthenticationError('Evernote is not authenticated');
  }

  const response: EvernoteNotesResponse = {};

  try {
    const notes = await fetchNotesMeta(ctx);
    console.log({ notes });
    response.notes = []; // TODO
  } catch (err) {
    response.error = `${err}`;
  }
  console.log({ response });
  return response;
};

// export const getNotesContent = async (
//   _root: unknown,
//   _args: unknown,
//   ctx: PrismaContext
// ): Promise<EvernoteNotesResponse> => {
//   const { req } = ctx;
//   const authenticated = isAuthenticated(req);

//   if (!authenticated) {
//     throw new AuthenticationError('Evernote is not authenticated');
//   }

//   const response: EvernoteNotesResponse = {};

//   try {
//     const notes = await fetchNotesContent(ctx);
//     response.notes = notes;
//   } catch (err) {
//     response.error = `${err}`;
//   }
//   return response;
// };

// export const getParsedNotes = async (
//   _root: unknown,
//   _args: unknown,
//   ctx: PrismaContext
// ): Promise<EvernoteNotesResponse> => {
//   const { req, prisma } = ctx;
//   const authenticated = isAuthenticated(req);

//   if (!authenticated) {
//     throw new AuthenticationError('Evernote is not authenticated');
//   }

//   const response: EvernoteNotesResponse = {};

//   try {
//     const notes = await parseNotes(prisma);
//     response.notes = notes;
//   } catch (err) {
//     console.log({ err });
//     response.error = `${err}`;
//   }
//   return response;
// };

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
//   ctx: PrismaContext
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
