import { gql } from '@apollo/client';

export const GET_EVERNOTE_SESSION_FOR_USER_QUERY = gql`
  query GET_EVERNOTE_SESSION_FOR_USER_QUERY($userId: String) {
    evernoteSession(userId: $userId) {
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

const all = {
  GET_EVERNOTE_SESSION_FOR_USER_QUERY
};

export default all;
