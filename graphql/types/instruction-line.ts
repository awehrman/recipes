import { objectType } from 'nexus';

export const InstructionLine = objectType({
  name: 'InstructionLine',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.nonNull.int('blockIndex');
    t.nonNull.string('reference');
    // recipe
    // recipeId
    // note
    // noteId
  }
});
