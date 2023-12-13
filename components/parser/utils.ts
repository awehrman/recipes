import { ParserRuleDefinition } from '@prisma/client';
import _ from 'lodash';

import { PEG_CHARACTERS } from 'constants/parser';
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

export const formatEmbeddedList = (rule: string): string => {
  const keywords = rule.slice(1, rule.length - 1).split(',');
  return keywords.join(', ');
};

// TODO fix return type
export const validateIndividualRule = (ruleInstanceName: string, rules: string[]): any => {
  const undefinedRules: any = [];
  const definedRules: any = [];
  const syntax: any = [];
  const ordered: any = [];

  const splitArray = ruleInstanceName.split(/([*!+$|()[\]])/).filter(Boolean);
  splitArray.forEach((splitPiece, index) => {
    const isSpecialCharacter = PEG_CHARACTERS.find(
      (char) => char === splitPiece
    );
    const isMissingRule = !rules.includes(splitPiece) && !isSpecialCharacter;
    if (isMissingRule) {
      ordered.push({ index, name: splitPiece, type: 'undefined' });
      return undefinedRules.push({ index, name: splitPiece });
    }
    const isDefinedRule = !rules.includes(splitPiece) && !isSpecialCharacter;
    if (isDefinedRule) {
      ordered.push({ index, name: splitPiece, type: 'defined' });
      return definedRules.push({ index, name: splitPiece });
    }
    ordered.push({ index, name: splitPiece, type: 'syntax' });
    return syntax.push({ index, name: splitPiece });
  });

  return {
    undefinedRules,
    definedRules,
    syntax,
    ordered
  };
};

export const isEmbeddedList = (str: string) =>
  str.startsWith('[') && (
    str.endsWith(']') || str.endsWith(']i')
  );

function excludeCharacters(inputString: string) {
  const exclusionList = /[.*!+$|()[\]]/g;
  return inputString.replace(exclusionList, '');
};

export const hasRuleWarning = (ruleString: string = '', ruleNames: string[] = []): any => {
  let hasWarning = false;
  const isList = isEmbeddedList(ruleString);
  if (isList) {
    return hasWarning;
  }

  const rules = ruleString.split(' ');
  for (const ruleInstance of rules) {
    const isLabeledRule = ruleInstance.includes(':');
    const ruleName = isLabeledRule ? excludeCharacters(ruleInstance.split(':')[1]) : excludeCharacters(ruleInstance);
    
    if (!ruleNames.includes(ruleName) && !PEG_CHARACTERS.some((c: string) => c === ruleName)) {
      hasWarning = true;
      return hasWarning;
    }
  }
  return hasWarning;
};