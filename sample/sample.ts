import { Prisma } from '@prisma/client';

import prisma from '../lib/prisma';
import { AppContext } from 'graphql/context';

export const createUser = async (
  user: Prisma.UserCreateInput,
  ctx: AppContext
) => {
  console.log('createUser');
  return await ctx.prisma.user.create({
    data: user
  });
};
