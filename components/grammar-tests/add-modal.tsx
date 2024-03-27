import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Modal from 'react-modal';
import styled from 'styled-components';

import { Button } from 'components/common';
import PlusIcon from 'public/icons/plus.svg';

// this is apparently for accessibility
Modal.setAppElement('#main-app');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const AddModal: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: 'expectations'
  });

  const onSubmit = (data) => {
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
        <h1>Add a New Grammar Test</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="referenceInput">Reference:</label>
            <input
              id="referenceInput"
              type="text"
              {...register('reference')}
              aria-label="Reference Input"
            />
          </div>
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
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
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

const Reference = styled.div``;

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
