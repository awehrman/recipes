import { InstructionLine, Prisma } from '@prisma/client';

export const formatInstructionLineUpsert = (
  instructions: InstructionLine[] = []
): Prisma.InstructionLineUpdateManyWithoutNoteNestedInput => {
  // TODO this a pretty dumb check; will want to replace this with _.every
  const isCreateInstructions = instructions?.[0]?.id === undefined;

  const createInstructions = instructions.map((line: InstructionLine) => ({
    blockIndex: line.blockIndex,
    reference: line.reference
  }));

  const updateInstructions = instructions.map((line: InstructionLine) => ({
    where: { id: line.id },
    data: { blockIndex: line.blockIndex, reference: line.reference }
  }));

  const upsert = isCreateInstructions
    ? { create: createInstructions }
    : { update: updateInstructions };

  return upsert;
};
