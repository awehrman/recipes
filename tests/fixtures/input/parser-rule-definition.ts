export const PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_A = (
  index: number = 0,
  parserRuleId: string = '-1'
) => ({
  id: `OPTIMISTIC-${index}`,
  rule: 'amt:amountKeyword',
  order: +`${index}`,
  example: 'one',
  formatter:
    '{\n' +
    '  return {\n' +
    '    rule: `#${ORDER}_amount`,\n' +
    "    type: 'amount',\n" +
    '    values: [amt]\n' +
    '  };\n' +
    '}',
  parserRuleId,
  type: 'RULE',
  list: []
});

export const PARSER_RULE_DEFINITION_TYPE_RULE_OPTIMISTIC_B = (
  index: number = 0,
  parserRuleId: string = '-1'
) => ({
  id: `OPTIMISTIC-${index}`,
  rule: 'amt:digits',
  order: +`${index}`,
  example: '11',
  formatter:
    '{\n' +
    '  return {\n' +
    '    rule: `#${ORDER}_amount`,\n' +
    "    type: 'amount',\n" +
    '    values: [...amt.values]\n' +
    '  };\n' +
    '}',
  parserRuleId,
  type: 'RULE',
  list: []
});

export const PARSER_RULE_DEFINITION_TYPE_LIST_OPTIMISTIC_A = (
  index: number = 0,
  parserRuleId: string = '-1'
) => ({
  id: `OPTIMISTIC-${index}`,
  rule: '',
  order: +`${index}`,
  example: '',
  formatter: '',
  parserRuleId,
  type: 'LIST',
  list: ["'three'i", "'one'i", "'two'i"]
});
