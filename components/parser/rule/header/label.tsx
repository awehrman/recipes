import _ from 'lodash';
import React, { useCallback, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';

import AutoWidthInput from '../auto-width-input';

type RuleComponentProps = {};

const RuleLabel: React.FC<RuleComponentProps> = () => {
  const {
    dispatch,
    state: { id, displayContext }
  } = useRuleContext();

  const {
    reset,
    setValue,
    watch,
    formState: { isDirty }
  } = useFormContext();
  const { rule } = useParserRule(id);
  const { label = '' } = rule;
  const watched = watch('name');
  const isActiveElement = useCallback(
    () => document.activeElement?.id === 'label',
    []
  )();

  useEffect(() => {
    if (!isActiveElement) {
      setValue('label', _.startCase(watched), { shouldValidate: true });
    }
  }, [isActiveElement, setValue, watched]);

  if (displayContext === 'display') {
    return <Label>{label}</Label>;
  }

  return <StyledAutoWidthInput grow defaultValue={label} fieldName="label" />;
};

export default RuleLabel;

const StyledAutoWidthInput = styled(AutoWidthInput)`
  font-weight: 600;
`;

const Label = styled.div`
  margin-right: 10px;
  width: 100%;
`;
