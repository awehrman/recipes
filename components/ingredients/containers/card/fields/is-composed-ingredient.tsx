import React, { useContext } from 'react';
import styled from 'styled-components';

import CardContext from 'contexts/card-context';

const IsComposedIngredient = () => {
  const {
    isEditMode,
    formState,
    methods: { register }
  } = useContext(CardContext);
  const { isComposedIngredient } = formState;
  const registerField = register('isComposedIngredient');

  return (
    <Wrapper>
      <Checkbox className={isEditMode ? 'editable' : ''}>
        <label htmlFor="isComposedIngredient">
          <input
            id="isComposedIngredient"
            defaultChecked={isComposedIngredient}
            name="isComposedIngredient"
            type="checkbox"
            {...registerField}
          />
          <span>Is Composed Ingredient?</span>
        </label>
      </Checkbox>
    </Wrapper>
  );
};

export default IsComposedIngredient;

const Wrapper = styled.div`
  order: 4;
  flex-basis: 50%;
  flex-grow: 2;
  text-align: right;
`;

// TODO dry this up between this and properties
const Checkbox = styled.div`
  display: inline-block;
  color: #222;

  label {
    font-weight: 400 !important;
    position: relative;
    padding-left: 18px;

    input {
      background: tomato;
      margin-right: 8px;
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      opacity: 0; /* we want to hide the original input, but maintain focus state */

      &:checked + span::after {
        position: absolute;
        top: 0;
        color: ${({ theme }) => theme.colors.altGreen};
        display: block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;

        font-family: 'Font Awesome 5 Pro';
        font-weight: 900;
        content: '\f00c';
      }
    }
  }

  label::before {
    display: block;
    position: absolute;
    top: 5px;
    left: 0;
    width: 11px;
    height: 11px;
    border-radius: 3px;
    background-color: white;
    border: 1px solid #aaa;
    content: '';
  }

  &.editable > label {
    cursor: pointer;
  }

  /* apply fake focus highlighting */
  &.editable > input:focus + label::before {
    outline: ${({ theme }) => theme.colors.altGreen} auto 3px;
  }
`;
