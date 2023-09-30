import React from 'react';
import styled from 'styled-components';

import AutoWidthInput from '../auto-width-input';

type RuleComponentProps = {
  definitionId: string;
  defaultValue: string;
  index: number;
};

const RuleExample: React.FC<RuleComponentProps> = ({
  definitionId,
  defaultValue,
  index = 0,
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
        grow
        onBlur={trimInput}
        placeholder="an example of this rule"
        {...props}
      />
    </Wrapper>
  );
};

export default RuleExample;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  color: #ccc;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;

  :before {
    content: '//';
    top: 3px;
    left: -16px;
    position: absolute;
  }
`;
