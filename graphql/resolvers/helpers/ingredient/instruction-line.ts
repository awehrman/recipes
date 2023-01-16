import { InstructionLine, Prisma } from '@prisma/client';

type InstructionLineCreateManyNoteInputEnvelope = {
  data: Prisma.InstructionLineCreateManyNoteInput[];
  skipDuplicates?: boolean;
};

export const formatInstructionLinesUpsert = (
  instructions: InstructionLine[] = []
): Prisma.InstructionLineUpdateManyWithoutNoteNestedInput => {
  let updateMany: Array<Prisma.InstructionLineUpdateManyWithWhereWithoutNoteInput> =
    new Array<Prisma.InstructionLineUpdateManyWithWhereWithoutNoteInput>();
  const data: Prisma.InstructionLineCreateManyNoteInput[] = [];
  const createMany: InstructionLineCreateManyNoteInputEnvelope = {
    data,
    skipDuplicates: true
  };

  instructions.forEach((line) => {
    if (!line?.id) {
      data.push({
        blockIndex: line.blockIndex,
        reference: line.reference
      });
    } else {
      updateMany.push({
        where: { id: line.id },
        data: {
          blockIndex: line.blockIndex,
          reference: line.reference
        }
      });
    }
  });

  const response: Prisma.InstructionLineUpdateManyWithoutNoteNestedInput = {};

  if (updateMany && updateMany?.length) {
    response.updateMany = updateMany;
  }

  if (data?.length) {
    response.createMany = createMany;
  }

  return response;
};
