import { objectType } from 'nexus';

export const AlternateName = objectType({
  name: 'AlternateName',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('ingredientId');
    // ingredient
  }
});
