import { gql } from '@apollo/client';

export const IMPORT_LOCAL_MUTATION = gql`
  mutation IMPORT_LOCAL_MUTATION {
    importLocal {
      errorMessage
    }
  }
`;

const all = {
  IMPORT_LOCAL_MUTATION
};

export default all;
