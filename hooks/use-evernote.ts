import { useQuery, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter, NextRouter } from 'next/router';
import { useEffect } from 'react';

import { MAX_NOTES_LIMIT } from '../constants/evernote';
import { AUTHENTICATE_EVERNOTE_MUTATION } from '../graphql/mutations/evernote-session';
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
    data: evernoteSessionData,
    loading,
    refetch
  } = useQuery(GET_EVERNOTE_SESSION_FOR_USER_QUERY, {
    variables: { id }
  });

  !loading && console.log({ ...(evernoteSessionData?.evernoteSession ?? {}) });
  const evernoteAuthToken = !loading && evernoteSessionData.evernoteAuthToken;
  const evernoteExpiration = !loading && evernoteSessionData.expires;
  const isExpired = !!(!loading && Date.now() > parseInt(evernoteExpiration));
  const isAuthenticated = !!(!loading && evernoteAuthToken && !isExpired);

  const [authenticateEvernote] = useMutation(AUTHENTICATE_EVERNOTE_MUTATION, {
    update: (_cache, { data: { authenticateEvernote } }) => {
      const { authURL = null } = authenticateEvernote || {};

      if (authURL) {
        window.open(authURL, '_self');
      }
    }
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
      console.log('refetching');
      refetch({ id });
    }
  }

  return {
    meta: {
      bundleSize
    },
    isAuthenticated,
    authenticateEvernote
  };
}

export default useEvernote;
