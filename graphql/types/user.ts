import { enumType, extendType, objectType, scalarType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.string('email');
    t.field('role', { type: Role });
    // createdAt     DateTime  @default(now())
    // updatedAt     DateTime  @updatedAt
    // name          String?
    // emailVerified DateTime? @map("email_verified")
    // image         String?
    // accounts      Account[]
    t.nullable.list.field('accounts', {
      type: 'Account',
      resolve: async (root) => {
        console.log('account resolver', { root });
        return [];
      }
    });
    // sessions      Session[]
  }
});

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
    t.string('String');
  }
});

const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN']
});

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      resolve(_parent, _args, ctx) {
        return ctx.prisma.user.findMany();
      }
    });
  }
});
