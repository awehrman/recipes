import { extendType, FieldResolver, objectType, stringArg } from 'nexus';

import {
  getEvernoteSessionForUser,
  handleAuthenticateEvernoteSession,
  handleClearEvernoteSession
} from '../resolvers/evernote-session';

export const EvernoteSession = objectType({
  name: 'EvernoteSession',
  definition(t) {
    t.nonNull.string('id');
    t.string('expires');
    t.boolean('isExpired');

    t.string('authURL');
    t.string('oauthVerifier');
    t.string('error');
    t.boolean('loading');

    t.string('evernoteAuthToken');
    t.string('evernoteReqToken');
    t.string('evernoteReqSecret');

    t.string('userId');
  }
});

export const EvernoteSessionForUserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('evernoteSession', {
      type: 'EvernoteSession',
      args: { userId: stringArg() },
      resolve: getEvernoteSessionForUser as FieldResolver<
        'Query',
        'evernoteSession'
      >
    });
  }
});

export const AuthenticateEvernoteSessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('authenticateEvernote', {
      type: 'EvernoteSession',
      args: { oauthVerifier: stringArg(), userId: stringArg() },
      resolve: handleAuthenticateEvernoteSession as FieldResolver<
        'Mutation',
        'authenticateEvernote'
      >
    });
  }
});

export const ClearEvernoteSessionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('clearEvernoteSession', {
      type: 'EvernoteSession',
      args: { userId: stringArg() },
      resolve: handleClearEvernoteSession as FieldResolver<
        'Mutation',
        'clearEvernoteSession'
      >
    });
  }
});
