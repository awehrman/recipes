import { MAX_NOTES_LIMIT } from '../constants/evernote';
// import { loadingIngredients, loadingInstructions } from 'constants/note';

export const loadingSkeleton = new Array(MAX_NOTES_LIMIT)
  .fill(null)
  .map((_empty, index) => ({
    __typename: 'Note',
    id: `${index}-note-optimistic-result`,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: null,
    content: null,
    image: null,
    evernoteGUID: `loading_note_skeleton_${index}`,
    title: 'Loading...',
    ingredients: [],
    instructions: [],
    isParsed: false
  }));
