import Evernote from 'evernote';
import { PrismaClient } from '@prisma/client';
import { EvernoteSession } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaContext } from '../context';
import { composeMiddlewareFns } from 'nexus/dist/plugin';

type EvernoteSessionForUserArgs = {
  userId: string;
};

type AuthenticateEvernoteSessionArgs = {
  oauthVerifier?: string;
  userId: string;
};

export const getEvernoteSessionForUser = async (
  _source: unknown,
  args: EvernoteSessionForUserArgs,
  ctx: PrismaContext
): Promise<EvernoteSession> => {
  console.log('[getEvernoteSessionForUser]');
  const { prisma } = ctx;
  const { userId } = args;

  let response: EvernoteSession = {
    id: v4(),
    expires: null,
    authURL: null,
    oauthVerifier: null,
    error: null,
    loading: true,
    evernoteAuthToken: null,
    evernoteReqToken: null,
    evernoteReqSecret: null,
    userId
  };

  try {
    const evernoteSessions = await prisma.evernoteSession.findMany({
      where: {
        userId,
        NOT: {
          AND: {
            expires: null,
            evernoteAuthToken: null
          }
        }
      }
    });

    console.log(evernoteSessions);

    if (evernoteSessions.length > 0) {
      // look for an active one
      const activeSession = evernoteSessions.find(
        ({ evernoteAuthToken, expires }) =>
          evernoteAuthToken && expires && !(new Date() > expires)
      );

      const now = new Date();
      const comparison =
        activeSession?.expires && !(new Date() > activeSession.expires);
      console.log({ now, comparison, expires: activeSession?.expires });

      if (activeSession) {
        console.log('returning active session');
        response = { ...activeSession, userId };
      }
    }
  } catch (err) {
    console.log('fuck fuck fuck');
    response.error = `${err}`;
  }
  console.log('returning default');
  return response;
};

export const handleAuthenticateEvernoteSession = async (
  _source: unknown,
  args: AuthenticateEvernoteSessionArgs,
  ctx: PrismaContext
): Promise<EvernoteSession> => {
  const { prisma } = ctx;
  const { oauthVerifier = null, userId } = args;

  const response: EvernoteSession = {
    id: v4(),
    expires: null,
    authURL: null,
    oauthVerifier,
    error: null,
    loading: true,
    evernoteAuthToken: null,
    evernoteReqToken: null,
    evernoteReqSecret: null,
    userId
  };

  try {
    const userSessions = await prisma.evernoteSession.findMany({
      where: {
        userId
      }
    });

    // check for active sessions
    const activeSession = getActiveSession(userSessions);
    if (!!activeSession) {
      return {
        ...activeSession,
        userId
      };
    }

    // check for partial evernote session response
    const inFlightSession = !!oauthVerifier && getInFlightSession(userSessions);
    if (!!inFlightSession) {
      return finalizeAuthentication(inFlightSession, prisma, oauthVerifier);
    }

    // otherwise create a new session and start the auth process
    const session = await prisma.evernoteSession.create({
      data: { loading: true, user: { connect: { id: userId } } }
    });

    return startAuthentication(session, prisma);
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};

// TODO should we tack this onto our main context alongside prisma?
export const client = new Evernote.Client({
  consumerKey: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_KEY,
  consumerSecret: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_SECRET,
  sandbox: process.env.NEXT_PUBLIC_EVERNOTE_ENVIRONMENT === 'sandbox',
  china: false
});

// TODO move these to a helpers file
const getActiveSession = (
  sessions: EvernoteSession[] = []
): EvernoteSession | undefined =>
  sessions.find(({ expires }) => !!(Date.now() > parseInt(`${expires}`)));

const getInFlightSession = (
  sessions: EvernoteSession[] = []
): EvernoteSession | undefined =>
  sessions.find(
    (session) => !!session.evernoteReqToken && !!session.evernoteReqSecret
  );

const startAuthentication = async (
  session: EvernoteSession,
  prisma: PrismaClient
): Promise<EvernoteSession> => {
  const { evernoteReqToken, evernoteReqSecret } =
    await requestEvernoteRequestToken();

  session.authURL = `${client.getAuthorizeUrl(evernoteReqToken)}` ?? null;
  session.loading = true;
  session.evernoteReqToken = evernoteReqToken;
  session.evernoteReqSecret = evernoteReqSecret;

  await prisma.evernoteSession.update({
    data: {
      authURL: `${client.getAuthorizeUrl(evernoteReqToken)}` ?? null,
      loading: true,
      evernoteReqToken,
      evernoteReqSecret
    },
    where: { id: session.id }
  });

  return session;
};

const finalizeAuthentication = async (
  session: EvernoteSession,
  prisma: PrismaClient,
  oauthVerifier: string
): Promise<EvernoteSession> => {
  const { evernoteReqSecret, evernoteReqToken, id } = session;
  try {
    const { evernoteAuthToken, expires } = await requestEvernoteAuthToken(
      `${evernoteReqToken}`,
      `${evernoteReqSecret}`,
      oauthVerifier
    );
    session.loading = false;
    session.evernoteAuthToken = evernoteAuthToken;
    session.expires = new Date(parseInt(expires));

    await prisma.evernoteSession.update({
      data: {
        loading: false,
        evernoteAuthToken,
        expires: new Date(parseInt(expires))
      },
      where: { id }
    });
  } catch (error: unknown) {
    session.error = JSON.stringify(error, null, 2);
  }

  return session;
};

type EvernoteRequestTokenProps = {
  evernoteReqSecret: string;
  evernoteReqToken: string;
};

type EvernoteAuthTokenProps = {
  evernoteAuthToken: string;
  expires: string;
};

const requestEvernoteRequestToken = (): Promise<EvernoteRequestTokenProps> =>
  new Promise((resolve, reject) => {
    const cb = (
      error: { statusCode: number; data?: any },
      evernoteReqToken: string,
      evernoteReqSecret: string
    ) => {
      if (error) {
        reject(error);
      }
      resolve({ evernoteReqToken, evernoteReqSecret });
    };
    client.getRequestToken(
      `${process.env.NEXT_PUBLIC_EVERNOTE_OAUTH_CALLBACK}`,
      cb
    );
  });

const requestEvernoteAuthToken = (
  evernoteReqToken: string,
  evernoteReqSecret: string,
  oauthVerifier: string
): Promise<EvernoteAuthTokenProps> =>
  new Promise((resolve, reject) => {
    type ResultsProps = {
      edam_expires?: string;
    };
    const cb = (
      err: { statusCode: number; data?: any },
      evernoteAuthToken: string,
      _secret: string,
      results: ResultsProps
    ) => {
      if (err) {
        reject(err);
      }
      resolve({
        evernoteAuthToken,
        expires: `${results?.edam_expires}`
      });
    };
    client.getAccessToken(
      `${evernoteReqToken}`,
      `${evernoteReqSecret}`,
      `${oauthVerifier}`,
      cb
    );
  });
