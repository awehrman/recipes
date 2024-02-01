import { MockContext, createMockContext } from '../../../../context';
import { AppContext } from 'graphql/context';

import {
  startLocalNotesImport,
  readLocalCategoryFiles
} from './local-importer';

import path from 'path';
// TODO fix this
import { copyFiles, resetTestData } from '../../../../tests/helpers/note/local-importer';

// TODO this is heavily based on runInBand being passed... i'm going to keep thinking on this long term

// TODO generalize this into a better helper function
let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(async () => {
  console.log('[beforeEach]')
  await resetTestData();
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as AppContext;
});

describe('graphql > resolvers > helpers > note > local-importer', () => {
  describe('startLocalNotesImport', () => {
    test('should return an empty notes response on empty import directory', async () => {
      const result = await startLocalNotesImport(ctx);
      expect(result.length).toEqual(0);
    });

    test('should return three notes within two categories', async () => {
      const cannoli = path.resolve('./tests/fixtures/local-import', 'Cannoli');
      await copyFiles(cannoli, 'Cannoli');
      const swordfish = path.resolve(
        './tests/fixtures/local-import',
        'Swordfish'
      );
      await copyFiles(swordfish, 'Swordfish');
      const response = await startLocalNotesImport(ctx);
      console.log({ response });
      expect(response.length).toEqual(3);
    });
  });

  // describe('readLocalCategoryFiles', () => {
  //   test('should return an empty notes response on empty import directory', async () => {
  //     const result = await readLocalCategoryFiles();
  //     expect(result.length).toEqual(0);
  //   });

  //   test('should return three notes within two categories', async () => {
  //     const cannoli = path.resolve('<rootDir>/tests/fixtures/local-import', 'Cannoli');
  //     await copyFiles(cannoli, 'Cannoli');
  //     const swordfish = path.resolve(
  //       './tests/fixtures/local-import',
  //       'Swordfish'
  //     );
  //     await copyFiles(swordfish, 'Swordfish');
  //     const response = await readLocalCategoryFiles();
  //     expect(response.length).toEqual(3);
  //   });
  // });

  // describe('readLocalCategoryFile', () => {
  //   // takes file and directoryPath
  //   // returns NotesMeta (unparsed)
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('parseNoteFromCategoryFile', () => {
  //   // takes $ and el
  //   // returns NotesMeta (unparsed)
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('getLocalNoteTitle', () => {
  //   // takes file
  //   // returns string
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('getLocalNoteSource', () => {
  //   // takes file
  //   // returns string
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('getLocalNoteContent', () => {
  //   // takes file
  //   // returns string
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('getLocalNoteCategories', () => {
  //   // takes file
  //   // returns string
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('getLocalNoteTags', () => {
  //   // takes file
  //   // returns string
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('getLocalParsedNoteContent', () => {
  //   // takes imported notes
  //   // returns parsedNotes and ingHash
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('saveNoteIngredients', () => {
  //   // takes ingHash and prisma context
  //   // returns ingHash
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });

  // describe('saveLocalNotes', () => {
  //   // takes parsed notes, ingHash and prisma context
  //   // returns final notes
  //   // test('should return a notes on success', async () => {
  //   //   // TODO
  //   // });
  //   // test('should throw an error on failure', async () => {
  //   //   // TODO
  //   // });
  // });
});
