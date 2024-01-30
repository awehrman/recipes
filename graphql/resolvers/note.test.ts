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
  describe('importLocalNotes', async () => {
    // takes _root, _args, ctx: AppContext
    // returns EvernoteNotesResponse
    test('should return a notes response on success', async () => {
      const response = await importLocalNotes({}, {}, ctx);
      expect(response.notes.length).toEqual(3);
    });
    // test('should return an error response on failure', async () => {
    //   // TODO
    // });
  });
});
