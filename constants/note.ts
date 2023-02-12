export const defaultLoadingStatus = {
  meta: false,
  content: false,
  saving: false
};

export const loadingIngredients = [
  {
    id: 1,
    blockIndex: 0,
    lineIndex: 0,
    reference: null,
    rule: null,
    parsed: [],
    isParsed: false,
    __typeName: 'IngredientLine'
  },
  {
    id: 2,
    blockIndex: 1,
    lineIndex: 0,
    reference: null,
    rule: null,
    parsed: [],
    isParsed: false,
    __typeName: 'IngredientLine'
  },
  {
    id: 3,
    blockIndex: 1,
    lineIndex: 1,
    reference: null,
    rule: null,
    parsed: [],
    isParsed: false,
    __typeName: 'IngredientLine'
  }
];

export const loadingInstructions = [
  { id: 1, blockIndex: 0, reference: null, __typeName: 'InstructionLine' },
  { id: 2, blockIndex: 1, reference: null, __typeName: 'InstructionLine' },
  { id: 3, blockIndex: 2, reference: null, __typeName: 'InstructionLine' }
];
