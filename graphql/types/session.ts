import { enumType, extendType, objectType } from 'nexus';

export const Session = objectType({
  name: 'Session',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('sessionToken');
    t.nonNull.string('userId');
    t.nonNull.string('expires');
    // user relation
  }
});
