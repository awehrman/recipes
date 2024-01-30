import '@prisma/client';

declare module '@prisma/client' {
  const noteMeta = Prisma.validator<Prisma.NoteArgs>()({
    include: {
      categories: true,
      tags: true
    }
  });

  type NoteMeta = Prisma.NoteGetPayload<typeof noteMeta> & {
    id?: string;
  };

  const noteWithRelations = Prisma.validator<Prisma.NoteArgs>()({
    include: {
      ingredients: true,
      instructions: true,
      categories: true,
      tags: true
    }
  });

  type NoteWithRelations = Prisma.NoteGetPayload<typeof noteWithRelations>;

  const parserRuleWithRelations = Prisma.validator<Prisma.ParserRuleArgs>()({
    include: {
      definitions: true
    }
  });

  type ParserRuleWithRelations = Prisma.ParserRuleGetPayload<
    typeof parserRuleWithRelations
  >;

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

  const ingredientWithRelations = Prisma.validator<Prisma.IngredientArgs>()({
    include: {
      alternateNames: true,
      substitutes: true,
      relatedIngredients: true,
      references: true,
      properties: true // TODO
    }
  });

  type IngredientWithRelations = Prisma.IngredientGetPayload<
    typeof ingredientWithRelations
  >;

  type EvernoteNotesMetaResponse = {
    error?: string;
    notes: NoteMeta[];
  };

  type EvernoteNotesResponse = {
    error?: string;
    notes: NoteWithRelations[];
  };

  type Container = {
    id: string;
    count: number;
    currentIngredientId?: string | null;
    currentIngredientName?: string | null;
    ingredients: IngredientWithRelations[];
    isExpanded: boolean;
    name: string;
  };

  type StatusProps = {
    meta: boolean;
    content: boolean;
    saving: boolean;
  };
}
