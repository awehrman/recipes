import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';
import HighlightedInput from '../highlighted-input';

type RuleComponentProps = {};

const RuleLabel: React.FC<RuleComponentProps> = () => {
  const { isEditMode, rule, ruleForm } = useContext(RuleContext);
  const { register } = ruleForm;
  const { label } = rule;

  // TODO auto label based on name change

  if (!isEditMode) {
    return <Label>{label}</Label>;
  }

  return (
    <Wrapper>
      <HighlightedInput
        defaultValue={label}
        fieldName="label"
        isEditMode={isEditMode}
        isRequired
        isSpellCheck={isEditMode}
        placeholder="label"
        registerField={register('label')}
      />
    </Wrapper>
  );
};

export default RuleLabel;

// TODO move these into a common file
const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
  input {
    font-weight: 600;
  }
`;

const Label = styled.div`
  margin-right: 10px;
`;
