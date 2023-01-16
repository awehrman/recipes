import {
  IngredientWithAltNames,
  IngredientLineWithParsed,
  Prisma,
  ParsedSegment
} from '@prisma/client';

type IngredientLineCreateManyNoteInputEnvelope = {
  data: Prisma.IngredientLineCreateManyNoteInput[];
  skipDuplicates?: boolean;
};

type IngredientValueHash = {
  [value: string]: IngredientWithAltNames | null;
};

type CreateIngredientData = {
  name: string;
  plural?: string;
};

type IngredientHash = {
  matchBy: string[];
  valueHash: IngredientValueHash;
  createData: CreateIngredientData[];
};

export const formatIngredientLinesUpsert = (
  lines: IngredientLineWithParsed[] = [],
  ingHash: IngredientHash
): Prisma.IngredientLineUpdateManyWithoutNoteNestedInput => {
  let updateMany: Array<Prisma.IngredientLineUpdateManyWithWhereWithoutNoteInput> =
    new Array<Prisma.IngredientLineUpdateManyWithWhereWithoutNoteInput>();
  const data: Prisma.IngredientLineCreateManyNoteInput[] = [];
  const createMany: IngredientLineCreateManyNoteInputEnvelope = {
    data,
    skipDuplicates: true
  };

  lines.forEach((line: IngredientLineWithParsed, index: number) => {
    // TODO it would be dope to put the parsed value on the fucking line in the schema
    const ingredientValue = line?.parsed
      ? line.parsed.find((p: ParsedSegment) => p.type === 'ingredient')?.value
      : null;
    const ingredientId = ingHash.valueHash?.[ingredientValue]?.id ?? null;
    if (!line?.id) {
      data.push({
        blockIndex: line.blockIndex,
        lineIndex: index,
        reference: line.reference,
        rule: line?.rule ?? null,
        isParsed: !!line?.parsed,
        ingredientId
      });
    } else {
      updateMany.push({
        where: { id: line.id },
        data: {
          blockIndex: line.blockIndex,
          lineIndex: index,
          reference: line.reference,
          rule: line?.rule ?? null,
          isParsed: !!line?.parsed,
          ingredientId
        }
      });
    }
  });

  const response: Prisma.IngredientLineUpdateManyWithoutNoteNestedInput = {};

  if (updateMany && updateMany?.length) {
    response.updateMany = updateMany;
  }

  if (data?.length) {
    response.createMany = createMany;
  }

  return response;
};
