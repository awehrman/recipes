import { useQuery, useMutation } from '@apollo/client';
import { ParserRuleDefinition, ParserRuleWithRelations } from '@prisma/client';

import {
  GET_ALL_PARSER_RULE_QUERY,
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

type ParserRule = {
  parserRule: ParserRuleWithRelations;
};

function useParserRule(id: string) {
  const violations: any[] = [];
  // this should fetch from the cache first since we have a type policy enabled
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_PARSER_RULE_QUERY, {
    variables: { id }
  });
  const { parserRule = {} } = data;

  const [addParserRule] = useMutation(ADD_PARSER_RULE_MUTATION);
  const [deleteParserRule] = useMutation(DELETE_PARSER_RULE_MUTATION);
  const [updateParserRule] = useMutation(UPDATE_PARSER_RULE_MUTATION);
  const [addParserRuleDefinition] = useMutation(
    ADD_PARSER_RULE_DEFINITION_MUTATION
  );

  function addRule(
    input: ParserRuleWithRelations // TODO does this need to be an input type specifically?
  ): void {
    try {
      addParserRule({
        variables: { input },
        update: (cache, res) => {
          refetch();
          const rules: ParserRules | null = cache.readQuery({
            query: GET_ALL_PARSER_RULES_QUERY
          });
          const data = {
            parserRules: [
              ...(rules?.parserRules ?? []),
              res.data?.addParserRule
            ]
          };
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

  function updateRule(input: ParserRuleWithRelations) {
    updateParserRule({
      variables: {
        input
      },
      update: () => {
        refetch();
      }
    });
  }

  // TODO fix this
  type AddParserRuleDefinitionArgsProps = {
    ruleId: string;
    example?: string;
    formatter?: string;
    order?: number;
    rule?: string;
  };

  function addNewRuleDefinition(input: AddParserRuleDefinitionArgsProps) {
    addParserRuleDefinition({
      variables: {
        input
      },
      update: () => {
        refetch();
        // TODO is this sufficient?
      }
    });
  }

  function saveRuleDefinition() {
    // TODO
  }

  function cancelRuleDefinition() {
    // TODO
  }

  return {
    addNewRuleDefinition,
    saveRuleDefinition,
    addRule,
    updateRule,
    deleteRule,
    loading,
    refetch,
    rule: parserRule,
    violations
  };
}

export default useParserRule;

useParserRule.whyDidYouRender = true;
