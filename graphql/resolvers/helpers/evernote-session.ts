import { EvernoteSession, PrismaClient } from '@prisma/client';
import Evernote from 'evernote';
import { v4 } from 'uuid';

import { AppContext } from '../../context';

type EvernoteAuthTokenProps = {
  evernoteAuthToken: string;
  expires: string;
};

type EvernoteRequestTokenProps = {
  evernoteReqSecret: string;
  evernoteReqToken: string;
};

export const getActiveSession = (
  sessions: EvernoteSession[] = []
): EvernoteSession | undefined =>
  sessions.find(({ expires }) => !!(Date.now() > parseInt(`${expires}`)));

export const getAuthorizedClient = (
  token: string | undefined
): Evernote.Client => {
  if (!token) {
    throw new Error('No access token provided for Evernote client!');
  }
  const authenticatedClient = new Evernote.Client({
    token,
    consumerKey: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_KEY,
    consumerSecret: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_SECRET,
    sandbox: process.env.NEXT_PUBLIC_EVERNOTE_ENVIRONMENT === 'sandbox',
    china: false
  });

  if (!authenticatedClient) {
    throw new Error('Could not create Evernote client!');
  }
  return authenticatedClient;
};

export const getDefaultEvernoteSessionResponse = (
  userId: string
): EvernoteSession => ({
  id: v4(),
  expires: null,
  isExpired: false,
  oauthVerifier: null,
  authURL: null,
  error: null,
  loading: true,
  evernoteAuthToken: null,
  evernoteReqToken: null,
  evernoteReqSecret: null,
  userId
});

export const getEvernoteStore = async (
  session: EvernoteSession
): Promise<Evernote.NoteStoreClient> => {
  const { evernoteAuthToken } = session;
  const client = getAuthorizedClient(`${evernoteAuthToken}`);

  try {
    const store = await client.getNoteStore();
    return store;
  } catch (err) {
    throw new Error('Could not access Evernote store!');
  }
};

export const getInFlightSession = (
  sessions: EvernoteSession[]
): EvernoteSession | undefined =>
  sessions.find(
    (session: EvernoteSession) =>
      !!session?.evernoteReqToken && !!session?.evernoteReqSecret
  );

export const isAuthenticated = async (
  session: EvernoteSession | null
): Promise<boolean> => {
  if (!session) {
    return false;
  }
  const { evernoteAuthToken, expires } = session;
  const isExpired = !!(new Date().getTime() > new Date(`${expires}`).getTime());
  const isAuthenticated = !!(evernoteAuthToken && !isExpired);

  return isAuthenticated;
};

export const finalizeAuthentication = async (
  ctx: AppContext,
  session: EvernoteSession,
  oauthVerifier: string
): Promise<EvernoteSession> => {
  const { evernoteClient, prisma } = ctx;
  if (!session) {
    throw new Error('No Session available');
  }
  const { evernoteReqSecret, evernoteReqToken, id } = session;
  try {
    const { evernoteAuthToken, expires } = await requestEvernoteAuthToken(
      evernoteClient,
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

export const requestEvernoteAuthToken = (
  evernoteClient: Evernote.Client,
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
    evernoteClient.getAccessToken(
      `${evernoteReqToken}`,
      `${evernoteReqSecret}`,
      `${oauthVerifier}`,
      cb
    );
  });

export const requestEvernoteRequestToken = (
  evernoteClient: Evernote.Client
): Promise<EvernoteRequestTokenProps> =>
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
    evernoteClient.getRequestToken(
      `${process.env.NEXT_PUBLIC_EVERNOTE_OAUTH_CALLBACK}`,
      cb
    );
  });

export const startAuthentication = async (
  ctx: AppContext
): Promise<EvernoteSession> => {
  const { evernoteClient, prisma, session } = ctx;

  if (!session) {
    throw new Error('No session available.');
  }
  const { evernoteReqToken, evernoteReqSecret } =
    await requestEvernoteRequestToken(evernoteClient);
  session.user.evernote.authURL =
    `${evernoteClient.getAuthorizeUrl(evernoteReqToken)}` ?? null;
  session.user.evernote.loading = true;
  session.user.evernote.evernoteReqToken = evernoteReqToken;
  session.user.evernote.evernoteReqSecret = evernoteReqSecret;
  const authURL = `${evernoteClient.getAuthorizeUrl(evernoteReqToken)}` ?? null;
  await prisma.evernoteSession.upsert({
    where: { id: session.user.evernote.id },
    update: {
      authURL,
      loading: true,
      evernoteReqToken,
      evernoteReqSecret
    },
    create: {
      authURL,
      loading: true,
      evernoteReqToken,
      evernoteReqSecret,
      user: {
        connect: { id: session.user.id }
      }
    }
  });

  return session.user.evernote;
};
