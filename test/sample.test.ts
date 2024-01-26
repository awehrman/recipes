import { useSession } from 'next-auth/react';

import { AppContext } from 'graphql/context';

import { createUser } from '../sample/sample';
import { MockContext, createMockContext } from '../context';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  const id = '123';

  enum ROLES {
    ADMIN = 'ADMIN'
  }

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
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user
  };

  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' };
    })
  };
});

let mockCtx: MockContext;
let ctx: AppContext;

beforeEach(() => {
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

test('mock session', async () => {
  const session = useSession();
  expect(session.status).toEqual('authenticated');
});
