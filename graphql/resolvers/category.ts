import { AppContext } from '../context';

type NoteCategoryArgs = {};

type NoteCategoryRoot = {
  id?: string;
};

export const getNoteCategories = async (
  root: NoteCategoryRoot,
  _args: NoteCategoryArgs,
  ctx: AppContext
) => {
  console.log('getNoteCategories', { root });
  if (!root?.id) {
    return [];
  }
  const categories = await ctx.prisma.category.findMany({
    where: { notes: { some: { id: root.id } } }
  });
  return categories;
};
