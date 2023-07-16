import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';
import HighlightedInput from '../highlighted-input';

type RuleComponentProps = {};

const RuleName: React.FC<RuleComponentProps> = () => {
  const { isEditMode, rule, ruleForm } = useContext(RuleContext);
  const { register } = ruleForm;
  const { name } = rule;

  if (!isEditMode) {
    return <Name>{name}</Name>;
  }

  return (
    <Wrapper>
      <HighlightedInput
        defaultValue={name}
        fieldName="name"
        isEditMode={isEditMode}
        isRequired
        isSpellCheck={isEditMode}
        placeholder="name"
        registerField={register('name')}
      />
    </Wrapper>
  );
};

export default RuleName;

// TODO move these into a common file
const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
`;

const Name = styled.div`
  margin-right: 10px;
  font-weight: 400;
`;
