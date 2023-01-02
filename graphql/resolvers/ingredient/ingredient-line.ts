import { PrismaContext } from '../../context';

type IngredientLineArgs = {};

type IngredientLineRoot = {
  id?: string;
};

export const getIngredientLines = async (
  root: IngredientLineRoot,
  _args: IngredientLineArgs,
  ctx: PrismaContext
) => {
  console.log('getIngredientLines', { root });
  if (!root?.id) {
    return [];
  }
  const lines = await ctx.prisma.ingredientLine.findMany({
    where: { noteId: root.id }
  });
  return lines;
};
