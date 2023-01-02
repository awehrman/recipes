import { EvernoteSession, PrismaClient } from '@prisma/client';
import Evernote from 'evernote';
import { v4 } from 'uuid';

type EvernoteAuthTokenProps = {
  evernoteAuthToken: string;
  expires: string;
};

type EvernoteRequestTokenProps = {
  evernoteReqSecret: string;
  evernoteReqToken: string;
};

// TODO should we tack this onto our main context alongside prisma?
export const client = new Evernote.Client({
  consumerKey: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_KEY,
  consumerSecret: process.env.NEXT_PUBLIC_EVERNOTE_API_CONSUMER_SECRET,
  sandbox: process.env.NEXT_PUBLIC_EVERNOTE_ENVIRONMENT === 'sandbox',
  china: false
});

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
  const client = new Evernote.Client({
    token,
    sandbox: process.env.EVERNOTE_ENVIRONMENT === 'sandbox',
    china: false
  });

  if (!client) {
    throw new Error('Could not create Evernote client!');
  }
  return client;
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
  console.log('getEvernoteStore', { session });
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
  console.log();
  if (!session) {
    return false;
  }
  const { evernoteAuthToken, expires } = session;
  const isExpired = !!(new Date().getTime() > new Date(`${expires}`).getTime());
  const isAuthenticated = !!(evernoteAuthToken && !isExpired);

  console.log('isAuthenticated', { isAuthenticated });
  return isAuthenticated;
};

export const finalizeAuthentication = async (
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

export const requestEvernoteAuthToken = (
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

export const requestEvernoteRequestToken =
  (): Promise<EvernoteRequestTokenProps> =>
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

export const startAuthentication = async (
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
