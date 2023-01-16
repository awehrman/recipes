import { useQuery, useMutation, FetchResult } from '@apollo/client';
import { NoteWithRelations } from '@prisma/client';

import { GET_ALL_NOTES_QUERY } from '../graphql/queries/note';
import {
  GET_NOTES_METADATA_MUTATION,
  GET_NOTES_CONTENT_MUTATION,
  SAVE_RECIPES_MUTATION
} from '../graphql/mutations/note';
import { defaultLoadingStatus } from 'constants/note';
import { loadingSkeleton, loadingContent } from 'lib/util';
import React, { SetStateAction } from 'react';

type Status = {
  meta: boolean;
  content: boolean;
  saving: boolean;
  // editing: boolean;
};

type NotesResponse = {
  notes?: NoteWithRelations[];
};

function useNotes(
  status: Status = defaultLoadingStatus,
  setStatus: React.Dispatch<SetStateAction<Status>>
) {
  const { data = {}, loading, refetch } = useQuery(GET_ALL_NOTES_QUERY, {});

  const notes: NoteWithRelations[] = data?.notes ?? [];

  const [getNotesContent] = useMutation(GET_NOTES_CONTENT_MUTATION, {
    update: (cache, { data: { getNotesContent } }) => {
      const notesWithContent = getNotesContent?.notes ?? [];
      console.log('update [getNotesContent]', { getNotesContent });
      if (notesWithContent.length) {
        cache.writeQuery({
          query: GET_ALL_NOTES_QUERY,
          data: { notes: notesWithContent }
        });
      }

      const updatedStatus = { ...status };
      updatedStatus.content = false;
      setStatus(updatedStatus);
    }
  });

  const [getNotesMeta] = useMutation(GET_NOTES_METADATA_MUTATION, {
    optimisticResponse: {
      getNotesMeta: {
        notes: loadingSkeleton
      }
    },
    update: (cache, { data: { getNotesMeta } }: FetchResult<any>) => {
      console.log('update [getNotesMeta]', { getNotesMeta });
      const returnedNotes = getNotesMeta?.notes ?? [];
      const isOptimisticResponse = returnedNotes.some(
        (note: NoteWithRelations) =>
          !!note.evernoteGUID.includes('loading_note_skeleton_')
      );

      if (isOptimisticResponse) {
        return returnedNotes;
      }

      const existingNotes: NotesResponse | null = cache.readQuery({
        query: GET_ALL_NOTES_QUERY
      });

      const data = {
        notes: [returnedNotes, ...(existingNotes?.notes ?? [])]
      };

      // tack on skeletons
      data.notes = loadingContent(data.notes);

      if (data.notes.length > 0) {
        cache.writeQuery({
          query: GET_ALL_NOTES_QUERY,
          data
        });

        // kick off the next process
        if (!isOptimisticResponse) {
          const updatedStatus = { ...status };
          updatedStatus.meta = false;
          updatedStatus.content = true;
          setStatus(updatedStatus);

          getNotesContent();
        }
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
