import {
  NoteMeta,
  NoteWithRelations,
  Prisma,
  PrismaClient
} from '@prisma/client';
import { AuthenticationError } from 'apollo-server-micro';
import Evernote from 'evernote';
import { performance } from 'perf_hooks';

import {
  METADATA_NOTE_SPEC,
  MAX_NOTES_LIMIT,
  NOTE_FILTER,
  NOTE_SPEC
} from 'constants/evernote';
import { AppContext } from '../../context';

import { addNewCategories } from './category';
import { getEvernoteStore } from './evernote-session';
import { uploadImage } from './image';
import { parseHTML } from './parser';
import { addNewTags } from './tag';
import { formatInstructionLineUpsert } from './ingredient/instruction-line';
import { formatIngredientLineUpsert } from './ingredient/ingredient-line';

export const fetchNotesMeta = async (
  ctx: AppContext,
  offset?: number
): Promise<NoteMeta[]> => {
  const { session } = ctx;
  if (!session) {
    throw new AuthenticationError('No evernote session available');
  }
  const store = await getEvernoteStore(session.user.evernote);
  const { noteImportOffset = 0 } = session?.user;

  // // fetch new note content from evernote
  const t0 = performance.now();

  console.log('offset:', offset ?? noteImportOffset);
  const notes: NoteMeta[] = await store
    .findNotesMetadata(
      NOTE_FILTER,
      offset ?? noteImportOffset,
      MAX_NOTES_LIMIT,
      METADATA_NOTE_SPEC
    )
    // write our metadata to our db
    .then(async (meta: Evernote.NoteStore.NotesMetadataList) =>
      saveNoteMetaData(ctx, store, meta?.notes ?? [])
    )
    .catch((err: Error) => {
      throw new Error(`Could not fetch notes metadata.`);
    });

  // increment the notes offset in our session
  await incrementOffset(ctx, notes.length);
  const t1 = performance.now();
  console.log(`[fetchNotesMeta] took ${(t1 - t0).toFixed(2)} milliseconds.`);
  return notes;
};

const saveNoteMetaData = async (
  ctx: AppContext,
  store: Evernote.NoteStoreClient,
  notesMeta: Evernote.NoteStore.NoteMetadata[] = []
): Promise<NoteMeta[]> => {
  const { prisma } = ctx;

  // TODO verify that these are indeed new notes
  const verifiedNotesMeta = await verifyNotes(ctx, notesMeta);
  console.log('# verified', verifiedNotesMeta.length);

  const categoriesHash = await addNewCategories(prisma, store, notesMeta);
  const tagsHash = await addNewTags(prisma, store, notesMeta);

  const notes: NoteMeta[] = await prisma.$transaction(
    notesMeta.map((meta) => {
      const data: Prisma.NoteCreateInput = {
        title: `${meta.title}`,
        evernoteGUID: `${meta.guid}`,
        source: meta?.attributes?.sourceURL ?? null
      };

      const categoryId: string | null =
        meta?.notebookGuid && categoriesHash?.[meta.notebookGuid]
          ? `${categoriesHash[meta.notebookGuid]?.id}`
          : null;

      if (categoryId) {
        data.categories = {
          connect: { id: categoryId }
        };
      }

      const tagGuids: Prisma.Enumerable<Prisma.TagWhereUniqueInput> = (
        meta.tagGuids ?? []
      ).map((guid) => ({
        id: `${tagsHash[guid]?.id}`
      }));

      if (tagGuids?.length) {
        data.tags = {
          connect: tagGuids
        };
      }

      const select = {
        id: true,
        title: true,
        source: true,
        evernoteGUID: true,
        tags: {
          select: {
            id: true,
            name: true,
            evernoteGUID: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            evernoteGUID: true
          }
        }
      };

      return prisma.note.create({
        data,
        select
      });
    })
  );

  return notes;
};

const verifyNotes = async (
  ctx: AppContext,
  notes: Evernote.NoteStore.NoteMetadata[]
): Promise<Evernote.NoteStore.NoteMetadata[]> => {
  console.log('verifyNotes');
  const { prisma, session } = ctx;
  const { noteImportOffset = 0 } = session?.user;

  // check if we've already imported any of these notes
  const evernoteGUIDs = notes.map((note) => `${note.guid}`);
  const existingNotes = await prisma.note.findMany({
    where: {
      evernoteGUID: {
        in: evernoteGUIDs
      }
    }
  });

  if (!existingNotes.length) {
    console.log('all good; nothing new');
    return notes;
  }
  const offset = noteImportOffset + existingNotes.length;
  console.log('incrementing', offset);
  await incrementOffset(ctx, offset);
  const moreNotes = await fetchNotesMeta(ctx, offset);
  console.log('moreNotes', moreNotes.length);
  return [...moreNotes, ...notes];
};

const incrementOffset = async (
  ctx: AppContext,
  noteImportOffset: number
): Promise<void> => {
  const { prisma, session } = ctx;

  if (session) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        noteImportOffset
      }
    });
  }
};

export const fetchNotesContent = async (
  ctx: AppContext
): Promise<NoteWithRelations[]> => {
  const { prisma, session } = ctx;
  if (!session) {
    throw new AuthenticationError('No evernote session available');
  }
  const store = await getEvernoteStore(session.user.evernote);

  // fetch new note content from evernote
  const t0 = performance.now();
  // fetch the notes lacking content
  const notesSansContent: NoteMeta[] | undefined = await prisma.note.findMany({
    where: { content: null },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      evernoteGUID: true,
      title: true,
      source: true,
      image: true,
      content: true,
      isParsed: true,
      categories: {
        select: {
          id: true,
          name: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!notesSansContent?.length) {
    return [];
  }
  const notes = await resolveContent(notesSansContent, store, prisma);
  const t1 = performance.now();
  console.log(`[fetchNotesContent] took ${(t1 - t0).toFixed(2)} milliseconds.`);
  return notes;
};

const resolveContent = async (
  notesSansContent: NoteMeta[],
  store: Evernote.NoteStoreClient,
  prisma: PrismaClient
): Promise<NoteWithRelations[]> =>
  await Promise.all(
    notesSansContent.map(async (noteMeta): Promise<NoteWithRelations> => {
      const { content, resources } = await store.getNoteWithResultSpec(
        noteMeta.evernoteGUID,
        NOTE_SPEC
      );

      // save image
      const imageBinary = resources?.[0]?.data?.body ?? null;
      let image = null;
      if (imageBinary) {
        const buffer = Buffer.from(imageBinary);
        const folder = { folder: 'recipes' };
        image = await uploadImage(buffer, folder).then(
          (data) => data?.secure_url
        );
      }

      // parse note content
      const { ingredients, instructions } = parseHTML(`${content}`, noteMeta);

      const note: NoteWithRelations = {
        ...noteMeta,
        content: `${content}`,
        image: image ? `${image}` : null,
        ingredients,
        instructions
      };

      // save new note info
      await saveNote(note, prisma);

      return note;
    })
  );

export const saveNote = async (
  note: NoteWithRelations,
  prisma: PrismaClient
): Promise<NoteWithRelations> => {
  const instructions = formatInstructionLineUpsert(note.instructions);
  const ingredients = await formatIngredientLineUpsert(
    note.ingredients,
    prisma
  );

  const updatedNote = await prisma.note.update({
    data: {
      // TODO eventually we'll add in the ability to edit these
      // title: note.title,
      source: note.source,
      // // categories?:
      // // tags?:
      image: note.image,
      content: note.content,
      isParsed: true,
      instructions,
      ingredients
    },
    where: { id: note.id },
    select: {
      id: true,
      source: true,
      image: true,
      content: true,
      isParsed: true,
      // TODO figure out what we actually want returned here
      ingredients: {
        select: {
          id: true,
          reference: true
        }
      },
      instructions: {
        select: {
          id: true,
          reference: true
        }
      }
    }
  });

  return updatedNote;
};
