import { Prisma, PrismaClient } from '@prisma/client';
import pluralize from 'pluralize';

export const findIngredient = async (
  name: string,
  prisma: PrismaClient
): Promise<unknown | null> => {
  const isSingular = pluralize.isSingular(name);
  let plural: string | null = isSingular ? null : name;
  const singular = isSingular ? name : pluralize.singular(name);
  if (plural === singular) {
    plural = null;
  }
  const where = {
    OR: [
      { name: { equals: name } },
      { plural: { equals: name } }
      // TODO search by altNames
    ]
  };
  if (plural) {
    where.OR.push({ name: { equals: plural } });
    where.OR.push({ plural: { equals: plural } });
  }
  const existing = await prisma.ingredient.findMany({ where });

  if (!existing?.length) {
    const data: Prisma.IngredientCreateInput = {
      name: singular
    };
    if (plural !== null) {
      data.plural = plural;
    }
    const ingredient = await prisma.ingredient.create({ data }).catch(() => {
      // most likely this was already created, so attempt to re-fetch it
      findIngredient(name, prisma);
    });
    if (ingredient?.id) {
      return { connect: { id: +ingredient.id } };
    }
  }
  if (existing?.length > 0 && existing?.[0]?.id) {
    return { connect: { id: +existing[0].id } };
  }

  return null;
};
