import path from 'path';
import { createMockContext, MockContext } from '../../context';
import { AppContext } from 'graphql/context';

import { importLocalNotes } from './note';
import { copyFiles, resetTestData } from 'tests/helpers/note/local-importer';

// TODO generalize this into a better helper function
let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(async () => {
  await resetTestData();
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as AppContext;
});

describe('graphql > resolvers > helpers > note', () => {
  describe('importLocalNotes', () => {
    test('should return empty notes with no files', async () => {
      const response = await importLocalNotes({}, {}, ctx);
      expect(response.notes.length).toEqual(0);
    });

    test('should return three notes within two categories', async () => {
      const cannoli = path.resolve('./tests/fixtures/local-import', 'Cannoli');
      await copyFiles(cannoli, 'Cannoli');
      const swordfish = path.resolve(
        './tests/fixtures/local-import',
        'Swordfish'
      );
      await copyFiles(swordfish, 'Swordfish');
      const response = await importLocalNotes({}, {}, ctx);
      expect(response.notes.length).toEqual(3);
    });
  });
});
