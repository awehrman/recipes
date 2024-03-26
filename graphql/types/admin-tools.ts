import { extendType, FieldResolver, objectType, stringArg } from 'nexus';

import {
  resetDatabase,
  resetParserRules,
  seedBasicParserRules
} from '../resolvers/admin-tools';

export const GenericResponse = objectType({
  name: 'GenericResponse',
  definition(t) {
    t.string('error');
  }
});

export const ResetDatabase = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('resetDatabase', {
      type: 'EvernoteSession',
      args: { userId: stringArg() },
      resolve: resetDatabase as FieldResolver<'Mutation', 'resetDatabase'>
    });
  }
});

export const ResetParserRules = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('resetParserRules', {
      type: 'GenericResponse',
      args: {},
      resolve: resetParserRules as FieldResolver<'Mutation', 'resetParserRules'>
    });
  }
});

export const SeedBasicParserRules = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('seedBasicParserRules', {
      type: 'GenericResponse',
      args: {},
      resolve: seedBasicParserRules as FieldResolver<
        'Mutation',
        'seedBasicParserRules'
      >
    });
  }
});
