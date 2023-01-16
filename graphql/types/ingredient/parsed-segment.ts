import { objectType } from 'nexus';

export const ParsedSegment = objectType({
  name: 'ParsedSegment',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.int('index');
    t.field('ingredient', {
      type: 'Ingredient',
      resolve: async (root, _args, ctx) => {
        if ((root?.type && root.type !== 'ingredient') || !root?.ingredientId) {
          return null;
        }
        const data = await ctx.prisma.ingredient.findUnique({
          where: { id: root.ingredientId }
        });

        return {
          id: data?.id,
          name: data?.name,
          plural: data?.plural
        };
      }
    });
    t.string('rule');
    t.string('type');
    t.string('value');
    t.string('ingredientId');
    t.string('ingredientLineId');
  }
});
