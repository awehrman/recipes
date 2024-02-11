import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import {
  RuleDefinitionProvider
} from 'contexts/rule-definition-context';
import useParserRule from 'hooks/use-parser-rule';
import PlusIcon from 'public/icons/plus.svg';

import { getOptimisticParserRuleDefinition } from '../../utils';
import SaveOptions from './save-options';
import RuleDefinition from './rule-definition';

const RuleBody: React.FC<any> = ({ reset }) => {
  const {
    state: { id, defaultValues, displayContext, index }
  } = useRuleContext();
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: 'definitions'
  });
  const { rule } = useParserRule(id);
  const { definitions = [] } = rule;

  function handleAddNewDefinitionClick() {
    const optimisticDefinition = getOptimisticParserRuleDefinition(fields, id);
    append(optimisticDefinition);
  }

  function renderDefinitions() {
    return fields.map((field: any, index: number) => {
      const definitionId = definitions?.[index]?.id ?? `OPTIMISTIC-${index}`;
      const defaultValue = defaultValues.definitions?.[index];
      
      return (
        <RuleDefinitionProvider
          key={field.id}
          index={index}
          definitionId={definitionId}
          defaultValue={defaultValue}
        >
          <RuleDefinition reset={reset} />
        </RuleDefinitionProvider>
      );
    });
  }

  return (
    <Wrapper>
      {renderDefinitions()}

      {displayContext !== 'display' ? (
        <AddNewDefinition
          icon={<PlusIcon />}
          label="Add New Definition"
          onClick={handleAddNewDefinitionClick}
        />
      ) : null}

      {displayContext !== 'display' ? (
        <SaveOptions reset={reset} />
      ) : null}
    </Wrapper>
  );
};

export default RuleBody;

const AddNewDefinition = styled(Button)`
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen};
  border: 0;
  padding: 0;
  font-size: 12px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const Wrapper = styled.div`
`;
