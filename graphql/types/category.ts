import { objectType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.string('id');
    t.string('name');
    t.string('evernoteGUID');
  }
});
