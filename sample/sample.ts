import { Prisma } from '@prisma/client';

import { AppContext } from 'graphql/context';

export const createUser = async (
  user: Prisma.UserCreateInput,
  ctx: AppContext
) => {
  return await ctx.prisma.user.create({
    data: user
  });
};
