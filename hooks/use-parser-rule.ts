import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';

import { ParserRuleWithRelationsWithTypeName } from 'components/parser/types';
import { GET_PARSER_RULE_QUERY } from '../graphql/queries/parser';
import {
  ADD_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  UPDATE_PARSER_RULE_MUTATION,
  ADD_PARSER_RULE_DEFINITION_MUTATION
} from '../graphql/mutations/parser';

import {
  handleAddRuleUpdate,
  handleAddNewRuleDefinitionRuleUpdate,
  handleDeleteRuleUpdate,
  handleUpdateRuleUpdate,
  removeTypename,
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
  const [addParserRuleDefinition] = useMutation(
    ADD_PARSER_RULE_DEFINITION_MUTATION
  );

  function addRule(data: ParserRuleWithRelationsWithTypeName): void {
    const input = removeTypename(data);
    addParserRule({
      optimisticResponse: {
        addParserRule: {
          ...data,
          id: '-1'
        }
      },
      variables: { input },
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
    // console.log('updateRule', { data });
    const input = removeTypename(data);
    updateParserRule({
      optimisticResponse: {
        updateParserRule: {
          ...data // TODO do we have to check or sub id's for any new definitions?
        }
      },
      variables: {
        input
      },
      update: (cache, res) => handleUpdateRuleUpdate(cache, res, input)
    });
  }

  function addNewRuleDefinition() {
    // console.log('addNewRuleDefinition');
    // input: ArgsValue<'Mutation', 'addParserRuleDefinition'>
    const input = {
      example: null,
      formatter: null,
      order: 0, // TODO increment this properly
      rule: '', // TODO allow nulls here
      ruleId: null,
      type: 'RULE',
      list: []
    };
    addParserRuleDefinition({
      optimisticResponse: {
        addParserRuleDefinition: {
          ...input,
          id: '-1',
          __typename: 'ParserRuleDefinition'
        }
      },
      variables: {
        ...input
      },
      update: (cache, res) =>
        handleAddNewRuleDefinitionRuleUpdate(cache, res, input)
    });
  }

  return {
    addNewRuleDefinition,
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
