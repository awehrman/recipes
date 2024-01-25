// import { expect, test, vi } from 'vitest';
// import { prisma as prismaMock } from '../lib/__mocks__/prisma';
import { createUser } from '../sample/sample';
// import { prismaMock } from '../context';
import { MockContext, createMockContext } from '../context';
import { AppContext } from 'graphql/context';

// vi.mock('lib/prisma');

// vi.mock('../lib/prisma', async () => {
//   const actual = await vi.importActual<typeof import('../lib/prisma')>(
//     '../lib/prisma'
//   );
//   return {
//     ...actual
//   };
// });

let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(() => {
  console.log('creating mock context');
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as AppContext;
});

enum ROLES {
  ADMIN = 'ADMIN'
}

test('createUser should return the generated user', async () => {
  const id = '123';
  const user = {
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: new Date(),
    image: null,
    role: ROLES.ADMIN,
    noteImportOffset: 0
  };

  mockCtx.prisma.user.create.mockResolvedValue(user);

  await expect(createUser(user, ctx)).resolves.toEqual({
    ...user
  });
});
