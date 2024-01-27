import {
  PARSER_RULE_DEFINITION_TYPE_LIST_OPTIMISTIC_A,
  PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_A,
  PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_B
} from './parser-rule-definition';

export const PARSER_RULE_SINGLE_RULE_DEFINITION_OPTIMISTIC_A = {
  id: '-1',
  label: 'Amount',
  name: 'amount',
  order: 0,
  definitions: [PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_B(0, '-1')]
};

export const PARSER_RULE_SINGLE_LIST_DEFINITION_OPTIMISTIC_A = {
  id: '-1',
  label: 'AmountKeyword',
  name: 'amountKeyword',
  order: 0,
  definitions: [PARSER_RULE_DEFINITION_TYPE_LIST_OPTIMISTIC_A(0, '-1')]
};

export const PARSER_RULE_MULTIPLE_RULE_DEFINITION_OPTIMISTIC_A = {
  id: '-1',
  label: 'Amount',
  name: 'amount',
  order: 0,
  definitions: [
    PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_A(0, '-1'),
    PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_B(1, '-1')
  ]
};

export const PARSER_RULE_MULTIPLE_MIXED_DEFINITION_OPTIMISTIC_A = {
  id: '-1',
  label: 'Amount',
  name: 'amount',
  order: 0,
  definitions: [
    PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_A(0, '-1'),
    PARSER_RULE_DEFINITION_TYPE_LIST_OPTIMISTIC_A(1, '-1')
  ]
};
