import { EvernoteNotesResponse } from '@prisma/client';
import { performance } from 'perf_hooks';

import { AppContext } from '../context';
import { startLocalNotesImport } from './helpers/note/local-importer';

export const importLocalNotes = async (
  _root: unknown,
  _args: unknown,
  ctx: AppContext
): Promise<EvernoteNotesResponse> => {
  console.log('[importLocalNotes]');
  const response: EvernoteNotesResponse = {
    notes: []
  };

  try {
    const t0 = performance.now();
    const result = await startLocalNotesImport(ctx);
    response.notes = [...result];
    const t1 = performance.now();
    console.log(
      `[importLocalNotes] took ${((t1 - t0) / 1000).toFixed(2)} seconds.`
    );
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};
