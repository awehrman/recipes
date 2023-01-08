import { IngredientLine, Prisma, PrismaClient } from '@prisma/client';

export const formatIngredientLineUpsert = async (
  ingredients: IngredientLine[] = [],
  prisma: PrismaClient
): Promise<Prisma.IngredientLineUpdateManyWithoutNoteNestedInput> => {
  // TODO this a pretty dumb check; will want to replace this with _.every
  const isCreateIngredients = ingredients?.[0]?.id === undefined;

  const createIngredients = await createIngredientLines(ingredients, prisma);
  const updateIngredients = await updateIngredientLines(ingredients, prisma);

  const upsert = isCreateIngredients
    ? { create: createIngredients }
    : { update: updateIngredients };

  return upsert;
};

const createIngredientLines = async (
  ingredients: IngredientLine[] = [],
  prisma: PrismaClient
): Promise<
  Prisma.XOR<
    Prisma.Enumerable<Prisma.IngredientLineCreateWithoutNoteInput>,
    Prisma.Enumerable<Prisma.IngredientLineUncheckedCreateWithoutNoteInput>
  >
> => {
  return [];
};

const updateIngredientLines = async (
  ingredients: IngredientLine[] = [],
  prisma: PrismaClient
): Promise<
  Prisma.Enumerable<Prisma.IngredientLineUpdateWithWhereUniqueWithoutNoteInput>
> => {
  return [];
};
