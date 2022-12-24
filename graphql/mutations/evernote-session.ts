import { gql } from '@apollo/client';

export const AUTHENTICATE_EVERNOTE_MUTATION = gql`
  mutation AUTHENTICATE_EVERNOTE_MUTATION(
    $oauthVerifier: String
    $userId: String
  ) {
    authenticateEvernote(oauthVerifier: $oauthVerifier, userId: $userId) {
      id
      expires
      isExpired
      authURL
      oauthVerifier
      error
      loading
      evernoteAuthToken
      evernoteReqToken
      evernoteReqSecret
      userId
    }
  }
`;

export const CLEAR_EVERNOTE_SESSION_MUTATION = gql`
  mutation CLEAR_EVERNOTE_SESSION_MUTATION($userId: String) {
    clearEvernoteSession(userId: $userId) {
      id
      isExpired
      userId
    }
  }
`;

const all = { AUTHENTICATE_EVERNOTE_MUTATION, CLEAR_EVERNOTE_SESSION_MUTATION };

export default all;
