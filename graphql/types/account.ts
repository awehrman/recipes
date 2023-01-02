import { objectType } from 'nexus';

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('userId');
    t.nonNull.string('type');
    t.nonNull.string('provider');
    t.nonNull.string('providerAccountId');
    t.string('refresh_token');
    t.string('access_token');
    t.int('expires_at');
    t.string('token_type');
    t.string('scope');
    t.string('id_token');
    t.string('session_state');
    // user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  }
});
