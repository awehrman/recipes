import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

type RuleComponentProps = {
  fieldKey: string;
  example: string;
  index: number;
};

const RuleExample: React.FC<RuleComponentProps> = ({
  fieldKey,
  example,
  index = 0
}) => {
  const { register } = useFormContext();
  const fieldName = `definitions.${index}.example`;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <Wrapper>
      <EditExample htmlFor={fieldName}>
        <Input
          {...register(fieldName)}
          key={fieldKey}
          id={fieldName}
          defaultValue={example}
          name={fieldName}
          onBlur={trimInput}
          placeholder="an example of this rule"
          type="text"
        />
      </EditExample>
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
`;

const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0;
  color: #ccc;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  margin-left: 15px;
  width: 100%;

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.headerBackground} inset;
    -webkit-text-fill-color: #ccc;
  }
`;

const EditExample = styled(LabelWrapper)`
  position: relative;
  width: 100%;

  :before {
    content: '//';
    top: -2px;
    position: absolute;
  }
`;
