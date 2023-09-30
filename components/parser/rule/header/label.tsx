import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';

import AutoWidthInput from '../auto-width-input';

type RuleComponentProps = {};

const RuleLabel: React.FC<RuleComponentProps> = () => {
  const {
    state: { id, displayContext }
  } = useRuleContext();

  const { setValue } = useFormContext();
  const { rule } = useParserRule(id);
  const { label = '', name = '' } = rule;
  const watched = useWatch({ name: 'name', defaultValue: name });
  const isNameActiveElement = useCallback(
    () => document.activeElement?.id === 'name',
    []
  )();

  useEffect(() => {
    const pattern = /[^a-zA-Z0-9]/;
    const hasSpecialCharacters = pattern.test(watched);
    const autoLabel = _.startCase(watched);
    if (
      isNameActiveElement &&
      displayContext !== 'display' &&
      !hasSpecialCharacters
    ) {
      setValue('label', autoLabel, { shouldValidate: true });
    }
  }, [isNameActiveElement, displayContext, setValue, watched]);

  return (
    <StyledAutoWidthInput
      grow
      defaultValue={label}
      fieldName="label"
      placeholder="label"
    />
  );
};

export default RuleLabel;

const StyledAutoWidthInput = styled(AutoWidthInput)`
  font-weight: 600;

  &::placeholder {
    font-weight: 400;
    color: #ccc;
    font-style: italic;
  }
`;
