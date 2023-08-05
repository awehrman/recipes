import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useWatch } from 'react-hook-form';

import RuleContext from 'contexts/rule-context';
import HighlightedInput from '../highlighted-input';

type RuleComponentProps = {};

const RuleLabel: React.FC<RuleComponentProps> = () => {
  const { isEditMode, rule, ruleForm } = useContext(RuleContext);
  const { control, register, setValue } = ruleForm;
  const { label } = rule;
  const watchName: string = useWatch({
    control,
    name: 'name',
    defaultValue: rule.name
  });

  useEffect(() => {
    const label = _.startCase(watchName);
    setValue('label', label);
  }, [setValue, watchName]);

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
