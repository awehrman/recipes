import { extendType, FieldResolver, idArg, objectType } from 'nexus';

import {
  getNotesMeta
  // getNotesContent,
  // getParsedNotes,
  // saveRecipes
} from '../resolvers/note';
import { getNoteCategories } from '../resolvers/category';
import { getNoteTags } from '../resolvers/tag';
import { resetDatabase } from '../resolvers/admin-tools';
import { getIngredientLines } from '../resolvers/ingredient/ingredient-line';
import { getInstructionLines } from '../resolvers/ingredient/instruction-line';

export const Note = objectType({
  name: 'Note',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.nonNull.string('evernoteGUID');
    t.nonNull.string('title');
    t.string('source');
    t.list.field('categories', {
      type: 'Category',
      resolve: getNoteCategories
    });
    t.list.field('tags', {
      type: 'Tag',
      resolve: getNoteTags
    });
    t.string('image');
    t.string('content');
    t.boolean('isParsed');
    t.list.field('ingredients', {
      type: 'IngredientLine'
      // TODO i guess i don't always need these?
      // maybe follow back up on tags and categories
      // resolve: getIngredientLines
    });
    t.list.field('instructions', {
      type: 'InstructionLine'
      // resolve: getInstructionLines
    });
  }
});

export const NoteMeta = objectType({
  name: 'NoteMeta',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('evernoteGUID');
    t.nonNull.string('title');
  }
});

export const EvernoteNotesResponse = objectType({
  name: 'EvernoteNotesResponse',
  definition(t) {
    t.string('error');
    t.list.field('notes', { type: Note });
  }
});

// NOTE: https://www.prisma.io/blog/using-graphql-nexus-with-a-database-pmyl3660ncst#3-expose-full-crud-graphql-api-via-nexus-prisma
// Queries
export const NotesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('notes', {
      type: Note,
      resolve: async (root, _args, ctx) => {
        const data = await ctx.prisma.note.findMany();
        console.log('notes query', { data });
        return data;
      }
    });
  }
});

export const NoteQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('note', {
      type: Note,
      args: { id: idArg() }
      // resolve: async (root, { id }, ctx) => {
      //   const note = await ctx.prisma.note.findUnique({
      //     where: { id }
      //   });

      //   return {
      //     note
      //   };
      // }
    });
  }
});

// Mutations
export const GetNotesMeta = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('getNotesMeta', {
      type: 'EvernoteNotesResponse',
      resolve: getNotesMeta as FieldResolver<'Mutation', 'getNotesMeta'>
    });
  }
});

// export const GetNotesContent = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('getNotesContent', {
//       type: 'EvernoteSession',
//       resolve: getNotesContent
//     });
//   }
// });

// export const GetParsedNotes = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('getParsedNotes', {
//       type: 'EvernoteSession',
//       resolve: getParsedNotes
//     });
//   }
// });

// export const SaveRecipes = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('saveRecipes', {
//       type: 'EvernoteSession',
//       resolve: saveRecipes
//     });
//   }
// });

// export const ResetDatabase = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('resetDatabase', {
//       type: 'EvernoteSession',
//       resolve: resetDatabase
//     });
//   }
// });
