import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

type RuleComponentProps = {};

const RuleLabel: React.FC<RuleComponentProps> = () => {
  const { isEditMode, rule, ruleForm } = useContext(RuleContext);
  const { register } = ruleForm;
  const { label } = rule;

  if (!isEditMode) {
    return <Label>{label}</Label>;
  }

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  return (
    <EditLabel id="rule-label-wrapper" htmlFor="label">
      <Input
        {...register('label')}
        id="label"
        defaultValue={label}
        name="label"
        onBlur={trimInput}
        placeholder="label"
        type="text"
      />
    </EditLabel>
  );
};

export default RuleLabel;

const Label = styled.div`
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

const EditLabel = styled(LabelWrapper)`
  margin-right: 10px;
`;
