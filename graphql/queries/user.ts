import { gql } from '@apollo/client';

export const GET_USER_AUTHENTICATION_QUERY = gql`
  query GET_USER_AUTHENTICATION_QUERY($id: ID) {
    user(id: $id) {
      id
      noteImportOffset
    }
  }
`;

const all = {
  GET_USER_AUTHENTICATION_QUERY
};

export default all;
