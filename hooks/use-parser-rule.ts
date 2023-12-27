import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';

import { ParserRuleWithRelationsWithTypeName } from 'components/parser/types';
import { GET_PARSER_RULE_QUERY } from '../graphql/queries/parser';
import {
  ADD_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  UPDATE_PARSER_RULE_MUTATION
} from '../graphql/mutations/parser';

import {
  handleAddRuleUpdate,
  handleDeleteRuleUpdate
} from './helpers/parser-rule';

function useParserRule(id: string) {
  // this should fetch from the cache first since we have a type policy enabled
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_PARSER_RULE_QUERY, {
    variables: { id }
  });
  const { parserRule = {} } = data;

  const [addParserRule] = useMutation(ADD_PARSER_RULE_MUTATION);
  const [deleteParserRule] = useMutation(DELETE_PARSER_RULE_MUTATION);
  const [updateParserRule] = useMutation(UPDATE_PARSER_RULE_MUTATION);

  function addRule(data: ParserRuleWithRelationsWithTypeName): void {
    addParserRule({
      optimisticResponse: {
        addParserRule: {
          ...data,
          __typename: 'ParserRule'
        }
      },
      variables: { input: data },
      update: (cache, res) => handleAddRuleUpdate(cache, res, data)
    });
  }

  function deleteRule(id: string) {
    deleteParserRule({
      optimisticResponse: {
        deleteParserRule: {
          id
        }
      },
      variables: { id },
      update: (cache, res) => handleDeleteRuleUpdate(cache, res, id, refetch)
    });
  }

  function updateRule(data: ParserRuleWithRelationsWithTypeName) {
    updateParserRule({
      optimisticResponse: {
        updateParserRule: {
          ...data
        }
      },
      variables: { input: data }
    });
  }

  return {
    addRule,
    updateRule,
    deleteRule,
    loading,
    refetch,
    rule: parserRule
  };
}

export default useParserRule;

useParserRule.whyDidYouRender = true;
