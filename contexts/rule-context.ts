import { ParserRuleDefinition, ParserRuleWithRelations } from '@prisma/client';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

const defaultView = {
  isEditMode: false,
  setIsEditMode: (value: boolean) => {},
  isHovered: false,
  setIsHovered: (value: boolean) => {},
  isExpanded: true,
  setIsExpanded: (value: boolean) => {},
  rule: {
    id: '-1',
    name: '',
    label: '',
    definitions: [] as ParserRuleDefinition[]
  } as ParserRuleWithRelations,
  violations: [] as string[],
  ruleForm: {} as UseFormReturn
};

const RuleContext = React.createContext(defaultView);

export default RuleContext;
