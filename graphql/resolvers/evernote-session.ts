import { EvernoteSession } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaContext } from '../context';

import {
  getActiveSession,
  getInFlightSession,
  getDefaultEvernoteSessionResponse,
  finalizeAuthentication,
  startAuthentication
} from './helpers/evernote-session';

type EvernoteSessionForUserArgs = {
  userId: string;
};

type AuthenticateEvernoteSessionArgs = {
  oauthVerifier?: string;
  userId: string;
};

type ClearEvernoteSessionArgs = {
  userId: string;
};

export const getEvernoteSessionForUser = async (
  _source: unknown,
  args: EvernoteSessionForUserArgs,
  ctx: PrismaContext
): Promise<EvernoteSession> => {
  const { prisma } = ctx;
  const { userId } = args;

  let response: EvernoteSession = {
    id: v4(),
    expires: null,
    isExpired: false,
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
        isExpired: false,
        NOT: {
          AND: {
            expires: null,
            evernoteAuthToken: null
          }
        }
      }
    });

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
        response = { ...activeSession, userId };
      }
    }
  } catch (err) {
    response.error = `${err}`;
  }
  return response;
};

export const handleAuthenticateEvernoteSession = async (
  _source: unknown,
  args: AuthenticateEvernoteSessionArgs,
  ctx: PrismaContext
): Promise<EvernoteSession> => {
  const { prisma } = ctx;
  const { oauthVerifier = null, userId } = args;

  const response: EvernoteSession = getDefaultEvernoteSessionResponse(userId);

  try {
    const userSessions = await prisma.evernoteSession.findMany({
      where: {
        userId,
        isExpired: false
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

export const handleClearEvernoteSession = async (
  _source: unknown,
  args: ClearEvernoteSessionArgs,
  ctx: PrismaContext
): Promise<EvernoteSession> => {
  const { prisma } = ctx;
  const { userId } = args;

  const response: EvernoteSession = getDefaultEvernoteSessionResponse(userId);

  try {
    const userSessions = await prisma.evernoteSession.findMany({
      where: {
        userId,
        isExpired: false
      }
    });

    // expire any of these sessions
    (userSessions ?? []).forEach(async ({ id }) => {
      await prisma.evernoteSession.update({
        data: { isExpired: true },
        where: { id }
      });
    });
    response.isExpired = true;
  } catch (err) {
    response.error = `${err}`;
  }
  console.log({ response });
  return response;
};
