import { IngredientWithAltNames, NoteWithRelations } from '@prisma/client';

export type IngredientValueHash = {
  [value: string]: IngredientWithAltNames | null;
};

export type CreateIngredientData = {
  name: string;
  plural?: string;
};

export type IngredientHash = {
  matchBy: string[];
  valueHash: IngredientValueHash;
  createData: CreateIngredientData[];
};

export type CreateParsedSegment = {
  // updatedAt: Date
  index: number;
  rule: string;
  type: string;
  value: string;
  ingredientId: string | null;
  ingredientLineId: string;
};

export type NotesWithIngredients = {
  parsedNotes: NoteWithRelations[];
  ingHash: IngredientHash;
};

export type ParsedNoteContent = {
  parsedNote: NoteWithRelations;
  ingHash: IngredientHash;
};
