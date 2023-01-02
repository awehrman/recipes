import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';

import { schema } from '../../graphql/schema';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import prisma from '../../lib/prisma';

import { PrismaContext } from '../../graphql/context';

import Cors from 'micro-cors';

const cors = Cors();

const apolloServer = new ApolloServer({
  schema,
  context: async (ctx: { req: MicroRequest }): Promise<PrismaContext> => {
    const session: Session | null = (await getSession(ctx)) ?? null;
    return { prisma, session };
  }
});

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql'
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false
  }
};
