import { IngredientLineWithParsed } from '@prisma/client';
import { objectType } from 'nexus';

export const IngredientLine = objectType({
  name: 'IngredientLine',
  definition(t) {
    t.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.int('blockIndex');
    t.int('lineIndex');
    t.string('reference');
    t.string('rule');
    // not really sure why this comes thru as undefined when just set to t.boolean
    t.field('isParsed', {
      type: 'Boolean',
      resolve: async (root: IngredientLineWithParsed) => root?.parsed?.length > 0
    });
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
