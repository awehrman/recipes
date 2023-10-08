import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import { useRuleContext } from 'contexts/rule-context';
import { RuleDefinitionProvider } from 'contexts/rule-definition-context';
import useParserRule from 'hooks/use-parser-rule';
import PlusIcon from 'public/icons/plus.svg';
import TrashIcon from 'public/icons/trash-can.svg';

import { EmptyComponentProps } from '../../types';
import { getDefaultDefinitions, findRuleDefinition } from '../../utils';
import Example from './example';
import Formatter from './formatter';
import Rule from './rule';

const RuleBody: React.FC<EmptyComponentProps> = () => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const showDeleteDefinitionButton = (index: number) =>
    displayContext !== 'display' && index !== 0;
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'definitions'
  });
  const { rule } = useParserRule(id);
  const { definitions = [] } = rule;

  function renderDefinitions() {
    return fields.map((field, index: number) => {
      const definitionId = definitions?.[0]?.id ?? '-1';
      const ruleDefinition = findRuleDefinition(definitionId, definitions);
      const { example, formatter, rule } =
        ruleDefinition ?? getDefaultDefinitions(index);
      const defaultValues = {
        example,
        formatter,
        rule
      };

      return (
        <RuleDefinitionProvider
          key={field.id}
          definitionId={definitionId}
          defaultValues={defaultValues}
          index={index}
        >
          <Wrapper>
            <Example />
            <Rule />
            <Formatter />
            {showDeleteDefinitionButton(index) ? (
              <DeleteButton
                icon={<TrashIcon />}
                onClick={() => handleRemoveDefinitionClick(index)}
                label="Remove definition"
              />
            ) : null}
          </Wrapper>
        </RuleDefinitionProvider>
      );
    });
  }

  function handleAddNewDefinitionClick() {
    const order = (fields ?? []).length + 1;
    append({ example: '', rule: '', formatter: '', order });
  }

  function handleRemoveDefinitionClick(index: number) {
    remove(index);
  }

  return (
    <Body>
      {renderDefinitions()}
      {displayContext !== 'display' ? (
        <AddNewDefinition
          icon={<PlusIcon />}
          label="Add New Definition"
          onClick={handleAddNewDefinitionClick}
        />
      ) : null}
    </Body>
  );
};

export default RuleBody;

const AddNewDefinition = styled(Button)`
  background: transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.altGreen};
  border: 0;
  padding: 0;
  top: 2px;
  position: relative;
  top: 30px;
  font-size: 12px;

  svg {
    position: relative;
    height: 12px;
    fill: ${({ theme }) => theme.colors.altGreen};
    top: 2px;
    margin-right: 5px;
  }
`;

const DeleteButton = styled(Button)`
  border: 0;
  background: transparent;
  color: tomato;
  float: right;

  svg {
    position: relative;
    height: 12px;
    top: 1px;
    fill: tomato;
    margin-right: 5px;
  }
`;

const Body = styled.div``;

const Wrapper = styled.div`
  margin: 6px 20px;
  font-size: 14px;
  flex-basis: 100%;
`;
