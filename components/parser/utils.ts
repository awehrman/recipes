import { ParserRuleDefinition } from '@prisma/client';
import _ from 'lodash';

import { WatchParserForm } from './types';

export const getDefaultDefinitions = (order: number = 0) => ({
  example: '',
  rule: '',
  formatter: '',
  order,
  type: 'RULE',
  list: []
});

export const findRuleDefinition = (
  definitionId: string,
  definitions: ParserRuleDefinition[] = []
) => definitions.find((def: ParserRuleDefinition) => def.id === definitionId);

export const getFieldUpdates = ({
  definitionId = null,
  fieldName = '',
  state = {},
  index
}: WatchParserForm): string | null => {
  const { definitions = [] } = state;
  const isTopLevelFormField = fieldName === 'name' || fieldName === 'label';
  // if this is a top-level field, we can directly get the values off the form
  if (isTopLevelFormField) {
    return state[fieldName];
  }

  // otherwise we'll need to find the definition first, then the value
  const definition = definitions.find(
    (def: ParserRuleDefinition) =>
      def.id === definitionId
  );
  return definition?.[fieldName];
};

export const getDefaultFormatter = (ruleName: string): string => 
  `{
  const values = [...].flatMap(value => value);
  return {
    rule: \`#\${ORDER}_${_.camelCase(ruleName)}\`,
    type: '${_.camelCase(ruleName)}',
    values
  };
}`;
