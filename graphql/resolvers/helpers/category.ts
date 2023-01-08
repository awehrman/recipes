import { Category, PrismaClient } from '@prisma/client';
import Evernote from 'evernote';

interface CategoryHash {
  [key: string]: Category | null;
}

export const addNewCategories = async (
  prisma: PrismaClient,
  store: Evernote.NoteStoreClient,
  notesMeta: Evernote.NoteStore.NoteMetadata[]
): Promise<CategoryHash> => {
  // gather our category ids
  let categoryGUIDs: string[] = [];
  const categoriesHash: CategoryHash = notesMeta.reduce(
    (prev: CategoryHash, curr, index) => {
      if (!curr?.notebookGuid) {
        return prev;
      }
      const evernoteGUID: string = `${curr.notebookGuid}`;
      if (!prev.hasOwnProperty(evernoteGUID)) {
        prev[evernoteGUID] = null;
        categoryGUIDs.push(evernoteGUID);
      }
      return prev;
    },
    {}
  );

  // check if we have any of these
  const categories = await prisma.category.findMany({
    where: {
      evernoteGUID: {
        in: categoryGUIDs
      }
    },
    select: {
      id: true,
      evernoteGUID: true,
      name: true
    }
  });

  await Promise.all(
    categoryGUIDs.map(async (guid) => {
      const existingCategory = categoriesHash[guid];
      if (!existingCategory?.id) {
        const existing = categories.find(
          (category) => category.evernoteGUID === guid
        );
        if (existing) {
          categoriesHash[guid] = existing;
        } else {
          // get more category info from evernote
          const categoryInfo = await store.getNotebook(`${guid}`);
          if (categoryInfo && categoryInfo?.name) {
            const category = await prisma.category.create({
              data: {
                evernoteGUID: guid,
                name: categoryInfo.name
              },
              select: {
                id: true,
                evernoteGUID: true,
                name: true
              }
            });
            if (category) {
              categoriesHash[guid] = { ...category };
            } else {
              delete categoriesHash[guid];
            }
          }
        }
      }
    })
  );

  return categoriesHash;
};
