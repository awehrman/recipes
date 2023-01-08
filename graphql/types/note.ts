import { extendType, FieldResolver, idArg, objectType } from 'nexus';

import {
  getNotesMeta,
  getNotesContent,
  getParsedNotes
  // saveRecipes
} from '../resolvers/note';
import { resetDatabase } from '../resolvers/admin-tools';

// TODO can this be an extension of NoteMeta?
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
      type: 'Category'
    });
    t.list.field('tags', {
      type: 'Tag'
    });
    t.string('image');
    t.string('content');
    t.boolean('isParsed');
    t.list.field('ingredients', {
      type: 'IngredientLine'
    });
    t.list.field('instructions', {
      type: 'InstructionLine'
    });
  }
});

export const NoteMeta = objectType({
  name: 'NoteMeta',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.nonNull.string('evernoteGUID');
    t.nonNull.string('title');
    t.string('source');
    t.list.field('categories', {
      type: 'Category'
    });
    t.list.field('tags', {
      type: 'Tag'
    });
    t.string('image');
    t.string('content');
    t.boolean('isParsed');
  }
});

export const EvernoteNotesMetaResponse = objectType({
  name: 'EvernoteNotesMetaResponse',
  definition(t) {
    t.string('error');
    t.list.field('notes', { type: NoteMeta });
  }
});

export const EvernoteNotesResponse = objectType({
  name: 'EvernoteNotesResponse',
  definition(t) {
    t.string('error');
    t.list.field('notes', { type: Note });
  }
});

// Queries
export const NotesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('notes', {
      type: Note
    });
  }
});

export const NoteQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('note', {
      type: Note,
      args: { id: idArg() }
    });
  }
});

// Mutations
export const GetNotesMeta = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('getNotesMeta', {
      type: 'EvernoteNotesMetaResponse',
      resolve: getNotesMeta as FieldResolver<'Mutation', 'getNotesMeta'>
    });
  }
});

export const GetNotesContent = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('getNotesContent', {
      type: 'EvernoteNotesResponse',
      resolve: getNotesContent as FieldResolver<'Mutation', 'getNotesContent'>
    });
  }
});

export const GetParsedNotes = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('getParsedNotes', {
      type: 'EvernoteNotesResponse',
      resolve: getParsedNotes as FieldResolver<'Mutation', 'getParsedNotes'>
    });
  }
});

// export const SaveRecipes = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('saveRecipes', {
//       type: 'EvernoteNotesResponse',
//       resolve: saveRecipes as FieldResolver<'Mutation', 'saveRecipes'>
//     });
//   }
// });

// export const ResetDatabase = extendType({
//   type: 'Mutation',
//   definition(t) {
//     t.field('resetDatabase', {
//       type: 'EvernoteNotesResponse',
//       resolve: resetDatabase as FieldResolver<'Mutation', 'resetDatabase'>
//     });
//   }
// });
