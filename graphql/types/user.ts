import { enumType, extendType, objectType } from 'nexus';

// import { EvernoteSession } from './evernote-session';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.string('name');
    t.string('email');
    // accounts           Account[]
    // sessions           Session[]
    // importedRecipes    Recipe[]
    t.int('noteImportOffset');
    t.field('role', { type: Role });
    // t.field('evernoteSession', {
    //   type: EvernoteSession,
    //   resolve: (root, args, ctx) => {
    //     console.log('User evernoteSession field resolver', { root, args, ctx });
    //     return {};
    //   }
    // });
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
      resolve(_root, _args, ctx) {
        return ctx.prisma.user.findMany();
      }
    });
  }
});
