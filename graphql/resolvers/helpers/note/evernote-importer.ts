import { AuthenticationError } from 'apollo-server-micro';

import { AppContext } from '../../../context';
import { isAuthenticated } from '../evernote-session';

export const validateSession = (ctx: AppContext): void => {
  const { session } = ctx;
  if (!session) {
    throw new AuthenticationError('No evernote session available');
  }

  const {
    user: { evernote }
  } = session;
  const authenticated = isAuthenticated(evernote);

  if (!authenticated) {
    throw new AuthenticationError('Evernote is not authenticated');
  }
};
