import {
  useQuery,
  useMutation,
  ApolloCache,
  FetchResult
} from '@apollo/client';
import { Note } from '@prisma/client';

import { GET_ALL_NOTES_QUERY } from '../graphql/queries/note';
import {
  GET_NOTES_METADATA_MUTATION
  // GET_NOTES_CONTENT_MUTATION,
  // GET_PARSED_NOTES_MUTATION,
  // SAVE_RECIPES_MUTATION
} from '../graphql/mutations/note';
import { MAX_NOTES_LIMIT } from '../constants/evernote';
import {
  defaultLoadingStatus,
  loadingIngredients,
  loadingInstructions
} from 'constants/note';

type Status = {
  meta: boolean;
  content: boolean;
  parsing: boolean;
  saving: boolean;
};

type NotesResponse = {
  notes?: Note[];
};

type GetNotesMetaPayload = {
  error?: string | undefined;
  notes?: Note[] | undefined;
};

type EvernoteNotesMetaDataResponse = {
  data: {
    getNotesMeta: GetNotesMetaPayload;
  };
};

// TODO move these
const loadingSkeleton = new Array(MAX_NOTES_LIMIT)
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

const loadingContent = (notes: Note[]): Note[] =>
  notes.map((note) => ({
    ...note,
    ingredients: loadingIngredients,
    instructions: loadingInstructions,
    __typename: 'Note'
  }));

function useNotes(
  status: Status = defaultLoadingStatus,
  setStatus: (status: Status) => void
) {
  const {
    data = {},
    loading,
    refetch
  } = useQuery(GET_ALL_NOTES_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-only'
  });

  const notes: Note[] = data?.notes ?? [];

  // const [getParsedNotes] = useMutation(GET_PARSED_NOTES_MUTATION, {
  //   update: (cache, { data: { getParsedNotes } }) => {
  //     const parsedNotes = getParsedNotes?.notes ?? [];

  //     cache.writeQuery({
  //       query: GET_ALL_NOTES_QUERY,
  //       data: { notes: parsedNotes }
  //     });

  //     const updatedStatus = { ...status };
  //     updatedStatus.parsing = false;
  //     setStatus(updatedStatus);
  //   }
  // });

  // const [getNotesContent] = useMutation(GET_NOTES_CONTENT_MUTATION, {
  //   update: (cache, { data: { getNotesContent } }) => {
  //     const newNotesFromResponse = getNotesContent?.notes ?? [];

  //     if (newNotesFromResponse.length) {
  //       const data = {
  //         notes: newNotesFromResponse.flatMap()
  //       };

  //       cache.writeQuery({
  //         query: GET_ALL_NOTES_QUERY,
  //         data
  //       });
  //     }

  //     const updatedStatus = { ...status };
  //     updatedStatus.content = false;
  //     updatedStatus.parsing = true;
  //     setStatus(updatedStatus);

  //     // kick off parsing process
  //     getParsedNotes();
  //   }
  // });

  const [getNotesMeta] = useMutation(GET_NOTES_METADATA_MUTATION, {
    optimisticResponse: {
      getNotesMeta: {
        notes: loadingSkeleton
      }
    },
    update: (cache, { data }: FetchResult<any>) => {
      console.log('update', { data });
      const returnedNotes = data?.getNotesMeta?.notes ?? [];
      const isOptimisticResponse = returnedNotes.some(
        (note: Note) => !!note.evernoteGUID.includes('loading_note_skeleton_')
      );
      // if (isOptimisticResponse) {
      //   console.log({ returnedNotes });
      //   return returnedNotes;
      // }

      const existingNotes: NotesResponse | null = cache.readQuery({
        query: GET_ALL_NOTES_QUERY
      });

      // const data = {
      //   notes: [newNotesFromResponse, ...(existingNotes?.notes ?? [])]
      // };

      // // tack on skeletons
      // if (!isOptimisticResponse) {
      //   data.notes = loadingContent(data.notes);
      // }

      // if (data.notes.length > 0) {
      //   cache.writeQuery({
      //     query: GET_ALL_NOTES_QUERY,
      //     data
      //   });

      //   // kick off the next process
      //   if (!isOptimisticResponse) {
      //     // update status
      //     const updatedStatus = { ...status };
      //     updatedStatus.meta = false;
      //     updatedStatus.content = true;
      //     setStatus(updatedStatus);

      //     // getNotesContent();
      // }
      // }
    }
  });

  function importNotes() {
    const updated = { ...status };
    updated.meta = true;
    setStatus(updated);
    getNotesMeta();
  }

  // const [saveRecipes] = useMutation(SAVE_RECIPES_MUTATION, {
  //   update: (cache) => {
  //     cache.writeQuery({
  //       query: GET_ALL_NOTES_QUERY,
  //       data: { notes: [] }
  //     });
  //     setStatus(defaultLoadingStatus);
  //   }
  // });

  return {
    loading,
    notes,
    refetchNotes: refetch,
    importNotes
    // saveRecipes,
    // getParsedNotes
  };
}

export default useNotes;
