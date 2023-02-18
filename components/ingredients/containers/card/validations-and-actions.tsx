import React, { useContext } from 'react';
import styled from 'styled-components';

import { Button } from '../../../common';
import CardContext from 'contexts/card-context';
import EditIcon from 'public/icons/edit.svg';

const ValidationsAndActions = () => {
  const {
    isEditMode,
    setIsEditMode,
    methods: {
      formState: { errors },
      reset
    }
  } = useContext(CardContext);
  // TODO we'll want to differentiate between warnings and errors at some point
  // but i'm not messing with the merge just yet so that can wait
  const hasErrors = errors ? Object.keys(errors).length : false;

  function handleEditClick() {
    setIsEditMode(true);
  }

  function handleCancelClick() {
    reset();
    setIsEditMode(false);
  }

  return (
    <Wrapper>
      {/* Warnings */}

      {/* Edit Button */}
      {!isEditMode && (
        <EditButton
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEditClick}
        />
      )}

      {/* Save Button */}
      {isEditMode && (
        <SaveButton type="submit" label="Save" disabled={!!hasErrors} />
      )}

      {/* Cancel Button */}
      {isEditMode && (
        <CancelButton label="Cancel" onClick={handleCancelClick} />
      )}
    </Wrapper>
  );
};

export default ValidationsAndActions;

const SaveButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  font-size: 14px;
  align-self: flex-end;

  &:disabled {
    cursor: not-allowed;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EditButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  font-size: 14px;
  align-self: flex-end;

  svg {
    margin-right: 8px;
    height: 14px;
  }
`;

const CancelButton = styled(Button)`
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #ccc;
  font-weight: 400;
  margin-right: 10px;
`;
