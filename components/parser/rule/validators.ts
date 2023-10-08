import { ParserRuleWithRelations } from '@prisma/client';

export const isDuplicateRule = (
  value: string,
  rules: ParserRuleWithRelations[],
  ruleId: string,
  fieldName: string
) => {
  const existingRule = rules.find(
    (rule: ParserRuleWithRelations) =>
      rule[fieldName] === value && rule.id !== ruleId
  );
  return !existingRule || 'This rule already exists.';
};

export const isNotEmpty = (value: string, fieldName: string) => {
  return value.trim() !== '' || `${fieldName} is required.`;
};
