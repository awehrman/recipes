import { gql } from '@apollo/client';

export const GET_ALL_NOTES_QUERY = gql`
  query GET_ALL_NOTES_QUERY {
    notes {
      id
      title
      source
      evernoteGUID
      image
      ingredients {
        id
        blockIndex
        isParsed
        lineIndex
        parsed {
          id
          index
          ingredient {
            id
            isValidated
            name
          }
          rule
          type
          value
        }
        reference
        rule
      }
      instructions {
        id
        blockIndex
        reference
      }
    }
  }
`;

export const GET_PENDING_CATEGORIES_QUERY = gql`
  query GET_PENDING_CATEGORIES_QUERY {
    getPendingCategories {
      error
      categories
    }
  }
`;

export const GET_DASHBOARD_PARSING_QUERY = gql`
  query GET_DASHBOARD_PARSING_QUERY {
    dashboardParsing {
      error
      parsingInstances {
        id
        reference
      }
      parsingErrors
      semanticErrors
      dataErrors
      instruction
      equipment
      baseRate
      adjustedRate
      parsingRate
      dataAccuracy
    }
  }
`;

export const GET_NOTES_COUNT_QUERY = gql`
  query GET_NOTES_COUNT_QUERY {
    noteAggregate {
      count
      importDefault
    }
  }
`;

const all = {
  GET_ALL_NOTES_QUERY,
  GET_DASHBOARD_PARSING_QUERY,
  GET_NOTES_COUNT_QUERY
};

export default all;
