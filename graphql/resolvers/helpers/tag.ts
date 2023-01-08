import { PrismaClient, Tag } from '@prisma/client';
import Evernote from 'evernote';

interface TagHash {
  // key indexed by tag evernoteGUID
  [key: string]: Tag | null;
}

interface NoteHash {
  // key indexed by note guid
  [key: string]: Tag | null;
}

export const addNewTags = async (
  prisma: PrismaClient,
  store: Evernote.NoteStoreClient,
  notesMeta: Evernote.NoteStore.NoteMetadata[]
): Promise<TagHash> => {
  // gather our tag ids
  let tagGUIDs: string[] = [];

  const tagsHash: TagHash = notesMeta.reduce((prev: TagHash, curr) => {
    const uniqueTagGuids: string[] = [
      ...new Set((curr?.tagGuids ?? []).flatMap((guid) => `${guid}`))
    ];
    uniqueTagGuids.forEach((evernoteGUID) => {
      if (!prev.hasOwnProperty(evernoteGUID)) {
        prev[evernoteGUID] = null;
        tagGUIDs.push(evernoteGUID);
      }
    });
    return prev;
  }, {});

  tagGUIDs = [...new Set(tagGUIDs)];
  // check if we have any of these
  const tags = await prisma.tag.findMany({
    where: {
      evernoteGUID: {
        in: tagGUIDs
      }
    },
    select: {
      id: true,
      evernoteGUID: true,
      name: true
    }
  });

  await Promise.all(
    tagGUIDs.map(async (guid) => {
      const existingTag = tagsHash[guid];
      if (!existingTag?.id) {
        const existing = tags.find((tag) => tag.evernoteGUID === guid);
        if (existing) {
          tagsHash[guid] = existing;
        } else {
          // get more tag info from evernote
          const tagInfo = await store.getTag(`${guid}`);
          if (tagInfo && tagInfo.name) {
            const tag = await prisma.tag.create({
              data: {
                evernoteGUID: guid,
                name: tagInfo.name
              },
              select: {
                id: true,
                evernoteGUID: true,
                name: true
              }
            });
            tagsHash[guid] = { ...tag };
          }
        }
      }
    })
  );

  return tagsHash;
};
