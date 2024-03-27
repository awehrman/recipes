import React, { useState } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import Modal from 'react-modal';
import styled from 'styled-components';

import { Button } from 'components/common';
import PlusIcon from 'public/icons/plus.svg';
import AutoWidthInput from 'components/parser/rule/auto-width-input';

// this is apparently for accessibility
Modal.setAppElement('#main-app');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '500px',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const AddModal: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty }
  } = useForm({
    mode: 'onBlur'
  });
  const { fields, append } = useFieldArray({
    control,
    name: 'expectations'
  });

  // TODO we'll re-use this for editing eventually and can pull this from a grammar specific context
  const defaultValue = '';
  const formUpdates = useWatch({ control });
  const dirtyValue = !isDirty ? defaultValue : formUpdates.reference;
  const placeholder = '1 cup fresh sliced, apples (cut into pieces)';
  const displaySizePlaceholder = !dirtyValue?.length ? placeholder : dirtyValue;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onSubmit = (data: any) => {
    console.log(data);
  };

  function handleOpenModalOnClick() {
    setIsOpen(true);
  }

  function handleCloseModalOnClick() {
    setIsOpen(false);
  }
  return (
    <Wrapper>
      <AddTestButton
        icon={<PlusIcon />}
        label="Add Test"
        onClick={handleOpenModalOnClick}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModalOnClick}
        style={customStyles}
        contentLabel="Add a New Grammar Test"
      >
        <Header>Add a New Grammar Test</Header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ReferenceLine>
            <label htmlFor="grammar-test-reference-line">Test sentence:</label>
            <ReferenceInput
              aria-label="Reference Input"
              className="grammar-test-input"
              defaultValue={''}
              displaySizePlaceholder={displaySizePlaceholder}
              isDisabled={false}
              isSpellCheck={true}
              // onBlur={(event: React.ChangeEvent<HTMLInputElement>) =>
              //   onBlur(event)
              // }
              // onFocus={() => onFocus()}
              placeholder={placeholder}
              registerField={{ ...register('reference') }}
              uniqueId="grammar-test-reference-line"
            />
          </ReferenceLine>
          <div>
            <button
              type="button"
              onClick={() => append({})}
              aria-label="Add Expectation"
            >
              Add Expectation
            </button>
          </div>
          {fields.map((item, index) => (
            <div key={item.id}>
              <label htmlFor={`expectation${index}`}>Expectation:</label>
              <Controller
                name={`expectations[${index}].type`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <select {...field} id={`expectation${index}`}>
                    <option value="INGREDIENT">Ingredient</option>
                    <option value="AMOUNT">Amount</option>
                    <option value="UNIT">Unit</option>
                    <option value="DESCRIPTORS">Descriptors</option>
                    <option value="COMMENTS">Comments</option>
                    <option value="OTHER">Other</option>
                  </select>
                )}
              />
              <Controller
                name={`expectations[${index}].value`}
                control={control}
                defaultValue=""
                render={({ field }) => <input {...field} type="text" />}
              />
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </Wrapper>
  );
};

export default AddModal;

const ReferenceInput = styled(AutoWidthInput)`
  flex-basis: 100%;
  border-bottom: 2px solid ${({ theme }) => theme.colors.altGreen}};
`;

const ReferenceLine = styled.fieldset`
  border: 0;
  margin: 0;
  padding: 0;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;

  label {
    flex-basis: 100%;
    font-weight: 400;
  }
`;

const Header = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 8px;
`;

const AddTestButton = styled(Button)`
  border: 0;
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.highlight}};
  padding: 4px 0px;
  font-size: 13px;
  margin-top: 10px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.highlight};
    top: 2px;
    margin-right: 5px;
  }
`;

const Wrapper = styled.div``;
