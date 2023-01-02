import { objectType } from 'nexus';

export const IngredientLine = objectType({
  name: 'IngredientLine',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.int('blockIndex');
    t.int('lineIndex');
    t.string('reference');
    t.string('rule');
    t.boolean('isParsed');
    t.list.field('parsed', {
      type: 'ParsedSegment',
      resolve: async (root, _args, ctx) => {
        if (!root?.id) {
          return [];
        }
        const lines = await ctx.prisma.parsedSegment.findMany({
          where: { ingredientLineId: root.id }
        });
        return lines;
      }
    });
    // recipe
    // recipeId
    // note
    // noteId
  }
});
