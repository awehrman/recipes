import { MockContext, createMockContext } from '../../context';
import { AppContext } from 'graphql/context';

import { importLocalNotes } from './note';

let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as AppContext;
});

describe('graphql > resolvers > helpers > note', () => {
  describe('importLocalNotes', () => {
    test('should return empty notes with no files', async () => {
      const response = await importLocalNotes({}, {}, ctx);
      expect(response.notes.length).toEqual(0);
    });
  });
});
