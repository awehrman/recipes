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

  const ingredientWithAltNames = Prisma.validator<Prisma.IngredientArgs>()({
    include: {
      alternateNames: true
    }
  });

  type IngredientWithAltNames = Prisma.IngredientGetPayload<
    typeof ingredientWithAltNames
  >;

  const ingredientLineWithParsed =
    Prisma.validator<Prisma.IngredientLineArgs>()({
      include: {
        parsed: true
      }
    });

  type IngredientLineWithParsed = Prisma.IngredientLineGetPayload<
    typeof ingredientLineWithParsed
  >;

  type EvernoteNotesMetaResponse = {
    error?: string;
    notes: NoteMeta[];
  };

  type EvernoteNotesResponse = {
    error?: string;
    notes: NoteWithRelations[];
  };

  type StatusProps = {
    meta: boolean;
    content: boolean;
    saving: boolean;
  };
}
