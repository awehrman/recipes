import { gql } from '@apollo/client';
import { ALL_NOTE_FIELDS } from '../fragments/note';

export const IMPORT_LOCAL_MUTATION = gql`
  mutation IMPORT_LOCAL_MUTATION {
    importLocal {
      error
      notes {
        ...NoteFields
      }
    }
  }
  ${ALL_NOTE_FIELDS}
`;

const all = {
  IMPORT_LOCAL_MUTATION
};

export default all;
