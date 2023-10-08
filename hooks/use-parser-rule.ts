import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { ParserRuleWithRelations, ParserRuleDefinition } from '@prisma/client';

import {
  GET_PARSER_RULE_QUERY,
  GET_ALL_PARSER_RULES_QUERY
} from '../graphql/queries/parser';
import {
  ADD_PARSER_RULE_MUTATION,
  DELETE_PARSER_RULE_MUTATION,
  UPDATE_PARSER_RULE_MUTATION,
  ADD_PARSER_RULE_DEFINITION_MUTATION
} from '../graphql/mutations/parser';

// TODO there's probably a smarter way to do this
type ParserRules = {
  parserRules: ParserRuleWithRelations[];
};

type ParserRuleDefinitionWithRelationsWithTypeName = ParserRuleDefinition & {
  __typename: string;
};

type ParserRuleWithRelationsWithTypeName = ParserRuleWithRelations & {
  __typename: string;
};

function removeTypename(data: ParserRuleWithRelationsWithTypeName) {
  const input = {
    ..._.omit(data, '__typename'),
    definitions: data.definitions.map(
      (definition: ParserRuleDefinitionWithRelationsWithTypeName) => ({
        ..._.omit(definition, '__typename')
      })
    )
  };
  return input;
}

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
    try {
      addParserRule({
        variables: { input },
        update: (cache, res) => {
          // TODO read/write fragment vs read/write all rules query vs read/write just this rule?
          const rules: ParserRules | null = cache.readQuery({
            query: GET_ALL_PARSER_RULES_QUERY
          });
          console.log('add update', { currentRules: rules });
          // TODO temp
          if (!(input?.definitions ?? []).length) {
            input.definitions = [];
          }
          const data = {
            // TODO sort by order
            parserRules: [
              ...(rules?.parserRules ?? []),
              {
                ...input,
                id: res.data?.addParserRule.id,
                __typename: 'ParserRule'
              }
            ]
          };
          console.log('add update', { updatedRules: data });
          cache.writeQuery({
            query: GET_ALL_PARSER_RULES_QUERY,
            data
          });
        }
      });
    } catch (e) {
      console.log({ e });
      // TODO handle error
    }
  }

  function deleteRule(id: string) {
    // TODO does this only remove the rule or also the connected definitions?
    deleteParserRule({
      variables: { id },
      update: (cache) => {
        const rules: ParserRules | null = cache.readQuery({
          query: GET_ALL_PARSER_RULES_QUERY
        });
        const data = {
          parserRules: (rules?.parserRules ?? []).filter(
            (rule: any) => rule.id !== id
          )
        };
        cache.writeQuery({
          query: GET_ALL_PARSER_RULES_QUERY,
          data
        });
      }
    });
  }

  function updateRule(data: ParserRuleWithRelationsWithTypeName) {
    const input = removeTypename(data);
    updateParserRule({
      variables: {
        input
      },
      update: (cache) => {
        // TODO maybe read/write fragment is better?
        const rules: ParserRules | null = cache.readQuery({
          query: GET_ALL_PARSER_RULES_QUERY
        });
        const updated = {
          parserRules: (rules?.parserRules ?? []).map(
            (rule: ParserRuleWithRelations) =>
              rule.id === data.id
                ? { ...input, __typename: 'ParserRule' }
                : rule
          )
        };
        cache.writeQuery({
          query: GET_ALL_PARSER_RULES_QUERY,
          data: updated
        });
      }
    });
  }

  function addNewRuleDefinition() {
    // input: ArgsValue<'Mutation', 'addParserRuleDefinition'>
    const input = {
      example: null,
      formatter: null,
      order: 0,
      rule: '', // TODO allow nulls here
      ruleId: null
    };
    addParserRuleDefinition({
      variables: {
        ...input
      },
      update: (cache, data) => {
        // TODO is this sufficient? ... probably not
        // i think we need to directly update the cache
        // refetch();
      }
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
