import { gql } from '@apollo/client';

export const AUTHENTICATE_EVERNOTE_MUTATION = gql`
  mutation AUTHENTICATE_EVERNOTE_MUTATION(
    $oauthVerifier: String
    $userId: String
  ) {
    authenticateEvernote(oauthVerifier: $oauthVerifier, userId: $userId) {
      id
      expires
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

const all = { AUTHENTICATE_EVERNOTE_MUTATION };

export default all;
