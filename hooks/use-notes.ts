import { useQuery, useMutation, FetchResult } from '@apollo/client';
import { NoteWithRelations, StatusProps } from '@prisma/client';

import { GET_ALL_NOTES_QUERY } from '../graphql/queries/note';
import {
  GET_NOTES_METADATA_MUTATION,
  GET_NOTES_CONTENT_MUTATION,
  SAVE_RECIPES_MUTATION
} from '../graphql/mutations/note';
import { defaultLoadingStatus } from 'constants/note';
// import { loadingSkeleton } from 'lib/util';
import { MAX_NOTES_LIMIT } from 'constants/evernote';
import React, { SetStateAction } from 'react';

type NotesResponse = {
  notes?: NoteWithRelations[];
};

function useNotes(
  status: StatusProps = defaultLoadingStatus,
  setStatus: React.Dispatch<SetStateAction<StatusProps>>
) {
  const { data = {}, loading, refetch } = useQuery(GET_ALL_NOTES_QUERY, {});

  const notes: NoteWithRelations[] = data?.notes ?? [];

  const [getNotesContent] = useMutation(GET_NOTES_CONTENT_MUTATION, {
    update: (cache, { data: { getNotesContent } }) => {
      const notesWithContent = getNotesContent?.notes ?? [];
      if (notesWithContent.length) {
        cache.writeQuery({
          query: GET_ALL_NOTES_QUERY,
          data: { notes: notesWithContent }
        });
      }

      const updatedStatus = { ...status };
      updatedStatus.meta = false;
      updatedStatus.content = false;
      setStatus(updatedStatus);
    }
  });

  const [getNotesMeta] = useMutation(GET_NOTES_METADATA_MUTATION, {
    optimisticResponse: {
      getNotesMeta: {
        notes: new Array(MAX_NOTES_LIMIT).fill(null).map((_empty, index) => ({
          // __typename: 'NoteMeta',
          id: `${index}-optimistic-note`,
          createdAt: new Date(),
          updatedAt: new Date(),
          source: null,
          content: null,
          image: null,
          evernoteGUID: `${index}-optimistic-note-guid`,
          title: 'Loading...',
          categories: [],
          tags: [],
          isParsed: false
        })),
        error: null
      }
    },
    update: (cache, response: FetchResult<any>) => {
      const returnedNotes = response?.data?.getNotesMeta?.notes ?? [];
      const isOptimisticResponse = returnedNotes.some(
        (note: NoteWithRelations) =>
          !!(note?.id ?? '').includes('optimistic-note')
      );
      const adjustedNotes = isOptimisticResponse
        ? returnedNotes.map((note: NoteWithRelations) => ({
            ...note,
            // __typename: 'Note',
            ingredients: [],
            instructions: []
          }))
        : returnedNotes.map((note: NoteWithRelations) => ({
            ingredients: [],
            instructions: [],
            ...note
            // __typename: 'Note'
          }));
      const existingNotes: NotesResponse | null = cache.readQuery({
        query: GET_ALL_NOTES_QUERY
      });

      const data = {
        notes: [...adjustedNotes, ...(existingNotes?.notes ?? [])]
      };

      if (data.notes.length > 0) {
        cache.writeQuery({
          query: GET_ALL_NOTES_QUERY,
          data
        });

        const updatedStatus = { ...status };

        // kick off the next process
        if (!isOptimisticResponse) {
          updatedStatus.meta = false;
          updatedStatus.content = true;
          setStatus(updatedStatus);
          return getNotesContent();
        }

        updatedStatus.meta = true;
        setStatus(updatedStatus);
      }
    }
  });

  const [saveRecipes] = useMutation(SAVE_RECIPES_MUTATION, {
    update: (cache) => {
      cache.writeQuery({
        query: GET_ALL_NOTES_QUERY,
        data: { notes: [] }
      });
      setStatus(defaultLoadingStatus);
    }
  });

  function importNotes() {
    const updated = { ...status };
    updated.meta = true;
    setStatus(updated);
    getNotesMeta();
  }

  return {
    loading,
    notes,
    refetchNotes: refetch,
    importNotes,
    saveRecipes
  };
}

export default useNotes;
