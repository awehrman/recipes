import React from 'react';
import styled from 'styled-components';

import AutoWidthInput from '../auto-width-input';

type RuleComponentProps = {
  definitionId: string;
  defaultValue: string;
  index: number;
  containerRefCallback: (ref: HTMLLabelElement | null) => void;
  sizeRefCallback: (ref: HTMLSpanElement | null) => void;
};

const RuleExample: React.FC<RuleComponentProps> = ({
  definitionId,
  defaultValue,
  index = 0,
  containerRefCallback,
  sizeRefCallback,
  ...props
}) => {
  const fieldName = `definitions.${index}.example`;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      <AutoWidthInput
        definitionId={definitionId}
        defaultValue={defaultValue}
        fieldName="example"
        definitionPath={fieldName}
        onBlur={trimInput}
        placeholder="an example of this rule"
        containerRefCallback={containerRefCallback}
        sizeRefCallback={sizeRefCallback}
        {...props}
      />
    </Wrapper>
  );
};

export default RuleExample;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  display: flex;
  color: #ccc;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;

  input {
    color: #ccc;
  }

  :before {
    content: '//';
    top: 3px;
    left: -16px;
    position: absolute;
  }
`;
