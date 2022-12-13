import { enumType, extendType, objectType, scalarType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.string('email');
    t.field('role', { type: Role });
  }
});

const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN', 'SUPERADMIN']
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
