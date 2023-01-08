import '@prisma/client';

declare module '@prisma/client' {
  const noteMeta = Prisma.validator<Prisma.NoteArgs>()({
    include: {
      categories: true,
      tags: true
    }
  });

  type NoteMeta = Prisma.NoteGetPayload<typeof noteMeta>;

  const noteWithRelations = Prisma.validator<Prisma.NoteArgs>()({
    include: {
      ingredients: true,
      instructions: true,
      categories: true,
      tags: true
    }
  });

  type NoteWithRelations = Prisma.NoteGetPayload<typeof noteWithRelations>;

  type EvernoteNotesMetaResponse = {
    error?: string;
    notes: NoteMeta[];
  };

  type EvernoteNotesResponse = {
    error?: string;
    notes: NoteWithRelations[];
  };
}
