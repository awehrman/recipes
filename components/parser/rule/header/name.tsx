import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

type RuleComponentProps = {};

const RuleName: React.FC<RuleComponentProps> = () => {
  const { isEditMode, rule, ruleForm } = useContext(RuleContext);
  const { register } = ruleForm;
  const { name } = rule;

  if (!isEditMode) {
    return <Name>{name}</Name>;
  }

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <EditName id="rule-name-wrapper" htmlFor="name">
      <Input
        {...register('name')}
        id="name"
        defaultValue={name}
        name="name"
        onBlur={trimInput}
        placeholder="name"
        type="text"
      />
    </EditName>
  );
};

export default RuleName;

const Name = styled.div`
  margin-right: 10px;
`;

// TODO move these into a common place
const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
`;

const Input = styled.input`
  padding: 0;
  color: #333;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  padding: 4px 6px;
  min-width: 50px;

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.headerBackground} inset;
    -webkit-text-fill-color: #333;
  }
`;

const EditName = styled(LabelWrapper)`
  margin-right: 10px;
`;
