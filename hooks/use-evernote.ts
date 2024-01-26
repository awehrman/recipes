import { useQuery, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter, NextRouter } from 'next/router';
import { useEffect } from 'react';

import { MAX_NOTES_LIMIT } from '../constants/evernote';
import {
  AUTHENTICATE_EVERNOTE_MUTATION,
  CLEAR_EVERNOTE_SESSION_MUTATION
} from '../graphql/mutations/evernote-session';
import { GET_EVERNOTE_SESSION_FOR_USER_QUERY } from '../graphql/queries/evernote-session';

const onHandleOAuthParams = (router: NextRouter) => {
  // clear out the params sent back from the authentication
  router.replace('/import', '/import', { shallow: true });
};

function useEvernote() {
  const { data } = useSession();
  if (!data?.user) {
    throw new Error('User not in session!');
  }
  const router: NextRouter = useRouter();
  const bundleSize = MAX_NOTES_LIMIT;
  const {
    query: { oauth_verifier }
  } = router;

  const {
    user: { id }
  } = data;

  const {
    data: evernoteData,
    loading,
    refetch
  } = useQuery(GET_EVERNOTE_SESSION_FOR_USER_QUERY, {
    variables: { id }
  });

  const evernoteAuthToken =
    !loading && evernoteData
      ? evernoteData.evernoteSession?.evernoteAuthToken
      : null;
  const evernoteExpiration =
    !loading && evernoteData ? evernoteData.evernoteSession?.expires : null;
  const isExpired = !!(
    !loading &&
    evernoteData &&
    !evernoteData.isExpired &&
    Date.now() > evernoteExpiration
  );
  const isAuthenticated = !!(!loading && evernoteAuthToken && !isExpired);

  const [authenticateEvernote] = useMutation(AUTHENTICATE_EVERNOTE_MUTATION, {
    update: (_cache, { data: { authenticateEvernote } }) => {
      const { authURL = null } = authenticateEvernote || {};

      if (authURL) {
        // window.open(authURL, '_self');
        window.location.href = authURL;
      }
    }
  });

  const [clearAuthentication] = useMutation(CLEAR_EVERNOTE_SESSION_MUTATION, {
    update: () => refetch({ id })
  });

  useEffect(handleEvernoteAuthVerifier, [
    authenticateEvernote,
    evernoteAuthToken,
    id,
    oauth_verifier,
    refetch,
    router
  ]);

  function handleEvernoteAuthVerifier() {
    if (oauth_verifier) {
      authenticateEvernote({
        update: () => onHandleOAuthParams(router),
        variables: { oauthVerifier: oauth_verifier }
      });
    } else if (!evernoteAuthToken) {
      refetch({ id });
    }
  }

  return {
    meta: {
      bundleSize
    },
    isAuthenticated,
    loading,
    authenticateEvernote,
    clearAuthentication
  };
}

export default useEvernote;
