import React, { CSSProperties } from 'react';
import { ParserRuleDefinition } from '@prisma/client';
import _ from 'lodash';
import { RULE_BOTTOM_MARGIN } from './rule/constants';
import { PEG_CHARACTERS } from 'constants/parser';
import {
  GetStyleProps,
  ParserRuleDefinitionPreSave,
  WatchParserForm
} from './types';

export const getDefaultDefinitions = (order = 0) => ({
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
  state = {}
}: WatchParserForm): string | null => {
  const { definitions = [] } = state;
  const isTopLevelFormField = fieldName === 'name' || fieldName === 'label';
  // if this is a top-level field, we can directly get the values off the form
  if (isTopLevelFormField) {
    return state[fieldName];
  }

  // otherwise we'll need to find the definition first, then the value
  const definition = definitions.find(
    (def: ParserRuleDefinition) => def.id === definitionId
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
  const hasSquareBracketRange = /\]/.test(rule);

  if (hasSquareBracketRange) {
    return rule;
  }
  const keywords = rule.slice(1, rule.length - 1).split(',');
  return `[${keywords.join(', ')}]`;
};

// export const validateIndividualRule = (
//   ruleInstanceName: string,
//   rules: string[]
// ) => {
//   const undefinedRules: any = [];
//   const definedRules: any = [];
//   const syntax: any = [];
//   const ordered: any = [];

//   const splitArray = ruleInstanceName.split(/([*!+$|()[\]])/).filter(Boolean);
//   splitArray.forEach((splitPiece, index) => {
//     const isSpecialCharacter = PEG_CHARACTERS.find(
//       (char) => char === splitPiece
//     );
//     const isMissingRule = !rules.includes(splitPiece) && !isSpecialCharacter;
//     if (isMissingRule) {
//       ordered.push({ index, name: splitPiece, type: 'undefined' });
//       return undefinedRules.push({ index, name: splitPiece });
//     }
//     const isDefinedRule = !rules.includes(splitPiece) && !isSpecialCharacter;
//     if (isDefinedRule) {
//       ordered.push({ index, name: splitPiece, type: 'defined' });
//       return definedRules.push({ index, name: splitPiece });
//     }
//     ordered.push({ index, name: splitPiece, type: 'syntax' });
//     return syntax.push({ index, name: splitPiece });
//   });

//   return {
//     undefinedRules,
//     definedRules,
//     syntax,
//     ordered
//   };
// };

export const isEmbeddedList = (str: string) =>
  str.startsWith('[') && (str.endsWith(']') || str.endsWith(']i'));

function excludeCharacters(inputString: string) {
  const exclusionList = /[.*!+$|()[\]]/g;
  return inputString.replace(exclusionList, '');
}

export const hasRuleWarning = (ruleString = '', ruleNames: string[] = []) => {
  let hasWarning = false;
  const isList = isEmbeddedList(ruleString);
  if (isList) {
    return hasWarning;
  }

  const rules = ruleString.split(' ');
  for (const ruleInstance of rules) {
    const isLabeledRule = ruleInstance.includes(':');
    const ruleName = isLabeledRule
      ? excludeCharacters(ruleInstance.split(':')[1])
      : excludeCharacters(ruleInstance);

    if (
      !ruleNames.includes(ruleName) &&
      !PEG_CHARACTERS.some((c: string) => c === ruleName)
    ) {
      hasWarning = true;
      return hasWarning;
    }
  }
  return hasWarning;
};

export const getOptimisticParserRuleDefinition = (
  fields: Record<'id', string>[],
  id = '-1'
): ParserRuleDefinitionPreSave => ({
  id: `OPTIMISTIC-${(fields ?? []).length}`,
  parserRuleId: id,
  example: '',
  rule: '',
  formatter: '',
  order: (fields ?? []).length,
  type: 'RULE',
  list: [],
  __typename: 'ParserRuleDefinition'
});

export const sortByLength = (list: string[]) => {
  function compareByLengthDesc(a: string, b: string) {
    return b.length - a.length;
  }

  return list.sort(compareByLengthDesc);
};

export const formatKeywordList = (value: string, list: string[]): string[] => {
  const commaSplit = value.split(',');
  const isCommaSplit = commaSplit.length > 1;
  if (isCommaSplit) {
    const splitList = commaSplit.map((str) => formatKeyword(str));
    const newList = sortByLength(Array.from(new Set([...list, ...splitList])));
    return newList;
  }

  const slashSplit = value.split('/');
  const isSlashSplit = slashSplit.length > 1;
  if (isSlashSplit) {
    const splitList = slashSplit.map((str) => formatKeyword(str));
    const newList = sortByLength(Array.from(new Set([...list, ...splitList])));
    return newList;
  }

  const autoFormatted = formatKeyword(value);
  const newList = sortByLength(Array.from(new Set([...list, autoFormatted])));
  return newList;
};

const formatKeyword = (value: string): string => {
  // if listItemEntryValue starts with a \' or a $( we'll take it as is
  // otherwise we'll wrap the string in quotes ('xyz'i)
  const withQuote = /^\\'/.test(value ?? '');
  const withSign = /^\$/.test(value ?? '');
  const autoFormatted = withQuote || withSign ? value : `\'${value}\'i`;
  return autoFormatted;
};

export const getDraggableStyle = ({
  provided,
  style,
  isDragging
}: GetStyleProps): CSSProperties => {
  const combined = {
    ...style,
    ...provided.draggableProps.style
  };

  const marginBottom = RULE_BOTTOM_MARGIN;
  // TODO hmm margin and background aren't on DraggingStyle...
  const withSpacing: CSSProperties = {
    ...combined,
    marginBottom,
    background: isDragging ? 'rgba(248, 248, 248, 1)' : 'white'
  };

  return withSpacing;
};
