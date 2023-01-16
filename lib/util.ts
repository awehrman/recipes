import { NoteWithRelations } from '@prisma/client';
import { MAX_NOTES_LIMIT } from '../constants/evernote';
import { loadingIngredients, loadingInstructions } from 'constants/note';

export const loadingSkeleton = new Array(MAX_NOTES_LIMIT)
  .fill(null)
  .map((_empty, index) => ({
    id: `${index}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: null,
    content: null,
    image: null,
    evernoteGUID: `loading_note_skeleton_${index}`,
    title: '',
    ingredients: [],
    instructions: [],
    isParsed: false
  }));

export const loadingContent = (
  notes: NoteWithRelations[]
): NoteWithRelations[] =>
  notes.map((note) => ({
    ...note,
    ingredients: loadingIngredients,
    instructions: loadingInstructions,
    __typename: 'Note'
  }));
