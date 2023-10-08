import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';
import useParserRules from 'hooks/use-parser-rules';

import AutoWidthInput from '../auto-width-input';
import { isDuplicateRule } from '../validators';

type RuleComponentProps = {};

const RuleLabel: React.FC<RuleComponentProps> = () => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { rules = [] } = useParserRules();

  const { setValue } = useFormContext();
  const { rule } = useParserRule(id);
  const { label = '', name = '' } = rule;
  const watched = useWatch({ name: 'name', defaultValue: name });
  const isNameActiveElement = useCallback(
    () => document.activeElement?.id === `${id}-name`,
    [id]
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
  }, [id, isNameActiveElement, displayContext, setValue, watched]);

  const containerRef = React.useRef<HTMLLabelElement | null>(null);
  const sizeRef = React.useRef<HTMLSpanElement | null>(null);

  const containerRefCallback = (node: HTMLLabelElement | null) => {
    // Set the containerRef.current to the node
    if (containerRef.current !== node) {
      containerRef.current = node;
    }
  };

  const sizeRefCallback = (node: HTMLSpanElement | null) => {
    // Set the sizeRef.current to the node
    if (sizeRef.current !== node) {
      sizeRef.current = node;
    }
  };

  return (
    <StyledAutoWidthInput
      defaultValue={label}
      fieldName="label"
      placeholder="label"
      containerRefCallback={containerRefCallback}
      sizeRefCallback={sizeRefCallback}
      validators={{
        isDuplicateRule: (value: string) =>
          isDuplicateRule(value, rules, id, 'label')
      }}
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
