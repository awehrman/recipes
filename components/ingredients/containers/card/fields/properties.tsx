import React, { useContext } from 'react';
import styled from 'styled-components';

import { PROPERTY_ENUMS } from 'constants/ingredient';
import CardContext from 'contexts/card-context';

const capitalize = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
};

type PropertyProps = {
  property: PropertyOptions;
};

type PropertyOptions = 'DAIRY' | 'FISH' | 'GLUTEN' | 'MEAT' | 'POULTRY' | 'SOY';

type PropertyKeyNames =
  | 'properties_DAIRY'
  | 'properties_FISH'
  | 'properties_GLUTEN'
  | 'properties_MEAT'
  | 'properties_POULTRY'
  | 'properties_SOY';

type PropertyChecks = {
  properties_DAIRY?: boolean;
  properties_FISH?: boolean;
  properties_GLUTEN?: boolean;
  properties_MEAT?: boolean;
  properties_POULTRY?: boolean;
  properties_SOY?: boolean;
};

const Property = ({ property }: PropertyProps) => {
  const {
    isEditMode,
    formState,
    methods: { register }
  } = useContext(CardContext);
  const { properties } = formState;
  const registerField = register(`properties.properties_${property}`);
  const propertyKey: PropertyKeyNames = `properties_${property}`;
  const defaultChecked = (properties as PropertyChecks)[propertyKey];

  return (
    <Checkbox className={isEditMode ? 'editable' : ''}>
      <label htmlFor={property}>
        <input
          id={property}
          defaultChecked={defaultChecked}
          name={`properties_${property}`}
          type="checkbox"
          {...registerField}
        />
        <span>{capitalize(property)}</span>
      </label>
    </Checkbox>
  );
};

const Properties = () => {
  const { isEditMode, formState } = useContext(CardContext);
  const { properties } = formState;
  function renderProperties() {
    let propertyKeys = PROPERTY_ENUMS;
    if (!isEditMode) {
      propertyKeys = propertyKeys.filter(
        (key) =>
          (properties as PropertyChecks)[
            `properties_${key}` as PropertyKeyNames
          ]
      );
    }
    return propertyKeys.map((property) => (
      <Property key={property} property={property as PropertyOptions} />
    ));
  }

  return <Wrapper>{renderProperties()}</Wrapper>;
};

export default Properties;

const Wrapper = styled.div`
  order: 1;
  text-align: right;
  flex-grow: 2;
  flex-basis: 50%;
`;

const Checkbox = styled.div`
  display: inline-block;
  margin-right: 10px;
  color: #222;

  &:last-of-type {
    margin-right: 0;
  }

  label {
    font-weight: 400 !important;
    position: relative;
    padding-left: 18px;

    input {
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
    border: 1px solid #ddd;
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
