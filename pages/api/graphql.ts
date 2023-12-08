import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import Evernote from 'evernote';
import Cors from 'micro-cors';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

import { AppContext } from '../../graphql/context';
import { schema } from '../../graphql/schema';
import prisma from '../../lib/prisma';

const cors = Cors();

const apolloServer = new ApolloServer({
  schema,
  context: async (ctx: { req: MicroRequest }): Promise<AppContext> => {
    const session: Session | null = (await getSession(ctx)) ?? null;
    // an unauthorized client used to fetch our auth keys
    const evernoteClient = new Evernote.Client({
      consumerKey: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_KEY,
      consumerSecret: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_SECRET,
      sandbox: false, // process.env.NEXT_PUBLIC_EVERNOTE_ENVIRONMENT === 'sandbox',
      china: false
    });

    return { evernoteClient, prisma, session };
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
