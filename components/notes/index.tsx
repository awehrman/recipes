import { NoteWithRelations, StatusProps } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

import { defaultLoadingStatus } from 'constants/note';

import Loader from '../common/loader';

import Ingredients from './ingredients';
import Instructions from './instructions';

type NotesProps = {
  notes: NoteWithRelations[];
  status: StatusProps;
};
const Notes: React.FC<NotesProps> = ({
  notes = [],
  status = defaultLoadingStatus
}) => {
  const showParsingLoader = status.meta || status.content;

  function renderNotes() {
    return notes.map((note, index) => {
      const {
        evernoteGUID,
        ingredients = [],
        instructions = [],
        image = null,
        title
      } = note;
      const domain = note?.source?.length > 0 && note.source.includes('www.') ? new URL(note.source) : { hostname: '' };
      const source = domain.hostname.replace('www.', '');
      const margin = !!image || ingredients?.length ? '0 0 20px' : '0';

      return (
        <Note key={`note_${evernoteGUID}_${index}`}>
          {/* Title */}
          <Title margin={margin}>{title}</Title>

          {/* Image */}
          {image ? (
            <SourceWrapper>
              <ImageWrapper>
                {/* width={400} height={222} */}
                {/* <Image src={`${image}`} alt={title} layout="fill" /> */}
              </ImageWrapper>
              {/* Source */}
              {source ? (
                <Source target="_blank" href={note?.source ?? '#'}>
                  {source}
                </Source>
              ) : null}
            </SourceWrapper>
          ) : null}

          {/* Parsing Loader */}
          {showParsingLoader ? <ParsingLoader /> : null}

          {/* Content */}
          {ingredients?.length ? (
            <Ingredients
              ingredients={ingredients}
              status={status}
              noteId={note.id}
            />
          ) : null}

          {instructions?.length ? (
            <Instructions instructions={instructions} status={status} />
          ) : null}
        </Note>
      );
    });
  }
  return <Wrapper>{renderNotes()}</Wrapper>;
};

export default Notes;

const Note = styled.li`
  background: ${({ theme }) => theme.colors.headerBackground};
  margin: 20px 0;
  padding: 12px 24px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SourceWrapper = styled.div`
  width: 100%;
  @media (min-width: ${({ theme }) => theme.sizes.desktop_small}) {
    width: 420px;
    position: absolute;
    right: 20px;
    margin-top: 20px;
  }
`;

const Source = styled.a`
  color: ${({ theme }) => theme.colors.altGreen};
  font-weight: bold;
  text-decoration: none;
  font-size: 14px;
  float: right;
  text-align: right;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  flex-basis: 420px;
  margin-bottom: 10px;
  width: 100%;

  > div {
    position: unset !important;
  }

  img {
    background: rgba(226, 226, 226, 1);
    object-fit: contain;
    width: 100% !important;
    position: relative !important;
    height: unset !important;
  }

  @media (min-width: ${({ theme }) => theme.sizes.desktop_small}) {
    img {
      width: 420px !important;
    }
  }
`;

const ParsingLoader = styled(Loader)``;

type TitleProps = {
  margin: string;
};

const Title = styled.span<TitleProps>`
  font-weight: normal;
  font-size: 18px;
  font-weight: 300;
  margin: ${({ margin }) => margin};
  min-width: 1px;
  flex-basis: 100%;
`;

const Wrapper = styled.ul`
  position: relative;
  margin: 0;
  padding: 0;
  // max-width: 850px;
  list-style: none;
`;
