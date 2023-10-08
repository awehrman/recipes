import { ParserRuleDefinition } from '@prisma/client';
import { HTMLBeautifyOptions } from 'js-beautify';

export const BEAUTIFY_OPTIONS: HTMLBeautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 1,
  preserve_newlines: true,
  indent_scripts: 'normal',
  end_with_newline: false,
  wrap_line_length: 110
};

export const getDefaultDefinitions = (order: number = 0) => ({
  example: '',
  rule: '',
  formatter: '',
  order
});

export const findRuleDefinition = (
  definitionId: string,
  definitions: ParserRuleDefinition[] = []
) => definitions.find((def: ParserRuleDefinition) => def.id === definitionId);
