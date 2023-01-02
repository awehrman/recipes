import { objectType } from 'nexus';

export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.nonNull.string('id');
    t.string('name');
    t.string('evernoteGUID');
  }
});
