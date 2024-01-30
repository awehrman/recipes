import { MockContext, createMockContext } from '../../../../context';
import { AppContext } from 'graphql/context';

import { importLocalNotes } from '../../note';
import {
  startLocalNotesImport,
  readLocalCategoryFiles
} from './local-importer';

let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as AppContext;
});

describe('graphql > resolvers > helpers > note > local-importer', () => {
  describe('startLocalNotesImport', () => {
    // takes ctx: AppContext
    // returns Notes
    test('should return a notes response on success', async () => {
      const result = await startLocalNotesImport(ctx);
      expect(result.length).toEqual(3);
    });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('readLocalCategoryFiles', () => {
    // returns NotesMeta (unparsed)
    test('should return a notes response on success', async () => {
      const result = await readLocalCategoryFiles();
      expect(result.length).toEqual(3);
    });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('readLocalCategoryFile', () => {
    // takes file and directoryPath
    // returns NotesMeta (unparsed)
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('parseNoteFromCategoryFile', () => {
    // takes $ and el
    // returns NotesMeta (unparsed)
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('getLocalNoteTitle', () => {
    // takes file
    // returns string
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('getLocalNoteSource', () => {
    // takes file
    // returns string
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('getLocalNoteContent', () => {
    // takes file
    // returns string
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('getLocalNoteCategories', () => {
    // takes file
    // returns string
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('getLocalNoteTags', () => {
    // takes file
    // returns string
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('getLocalParsedNoteContent', () => {
    // takes imported notes
    // returns parsedNotes and ingHash
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('saveNoteIngredients', () => {
    // takes ingHash and prisma context
    // returns ingHash
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });

  describe('saveLocalNotes', () => {
    // takes parsed notes, ingHash and prisma context
    // returns final notes
    // test('should return a notes on success', async () => {
    //   // TODO
    // });
    // test('should throw an error on failure', async () => {
    //   // TODO
    // });
  });
});
