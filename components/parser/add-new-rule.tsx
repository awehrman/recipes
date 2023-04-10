// @ts-nocheck
// TODO come back and clean up ur types
import React, { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from 'components/common';
import HighlightedInput from 'components/parser/highlighted-input';
import { capitalize } from 'lodash';
import { v4 } from 'uuid';

type DefinitionProps = {
  example: string;
  definition: string;
  formatter?: string;
};

type RuleProps = {
  name: string;
  label: string;
  definitions: DefinitionProps[];
};

type RulesProps = {
  showNewRuleForm: boolean;
  setShowNewRuleForm: any;
  register: any;
  control: any;
  errors: any;
  trigger: any;
  setValue: any;
};

const AddNewRule: React.FC<RulesProps> = ({
  showNewRuleForm,
  setShowNewRuleForm,
  register,
  control,
  setValue
}) => {
  const watchName = useWatch({ control, name: 'new-name', defaultValue: '' });
  const watchDefinitions = useWatch({
    control,
    name: 'new-definitions',
    defaultValue: [
      {
        id: v4(),
        example: '',
        definition: '',
        formatter: ''
      }
    ]
  });
  const labelDefaultValue = (watchName: string) =>
    `"${watchName.length ? watchName : 'Rule Name'}"`;
  function handleNewRuleButtonClick() {
    setShowNewRuleForm(true);
  }

  function createLabel(value: string) {
    const words = value.split(/(?=[A-Z])/);
    return words.map((v: string) => capitalize(v)).join(' ');
  }

  useEffect(() => {
    const label = createLabel(watchName);
    setValue('new-label', label);
  }, [setValue, watchName]);

  if (!showNewRuleForm) {
    return (
      <AddNewRuleButton
        label="Add New Rule"
        onClick={handleNewRuleButtonClick}
      />
    );
  }

  return (
    <Wrapper>
      <Header>Add Rule</Header>
      <FieldSet>
        <HighlightedInput
          autoFocus
          autoComplete={false}
          defaultValue=""
          fieldName="new-name"
          isRequired
          loading={false}
          placeholder="ruleName"
          registerField={register}
          control={control}
        />
      </FieldSet>
      <FieldSet>
        <BlockQuote>
          <HighlightedInput
            defaultValue={labelDefaultValue(watchName)}
            autoComplete={false}
            fieldName="new-label"
            isRequired
            loading={false}
            placeholder="Rule Name"
            registerField={register}
            control={control}
          />
        </BlockQuote>
        <Equals />
      </FieldSet>
      <Break />
      {watchDefinitions.map((definition: any, index: number) => {
        return (
          <Definition key={`new-definition-${definition.id}`}>
            <Comment />
            <ExampleInput
              autoComplete={false}
              defaultValue=""
              placeholder="example"
              fieldName={`new-definition-${definition.id}-example`}
              loading={false}
              registerField={register}
              control={control}
            />
            <DefinitionInput
              autoComplete={false}
              defaultValue=""
              placeholder="rule definition"
              isRequired={index === 0}
              fieldName={`new-definition-${definition.id}-definition`}
              loading={false}
              registerField={register}
              control={control}
            />
            <FormatterTextArea
              defaultValue=""
              placeholder="formatter (optional)"
              fieldName={`new-definition-${definition.id}-formatter`}
              loading={false}
              {...register(`new-definition-${definition.id}-formatter`)}
            />
          </Definition>
        );
      })}
      <Break />
      <SubmitButton value="Submit" type="submit" />
    </Wrapper>
  );
};

export default AddNewRule;

const FieldSet = styled.fieldset`
  order: 0;
  display: flex;
  flex-wrap: wrap;
  border: 0;
  position: relative;
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 20px;
  margin-bottom: 8px;
  height: 1em;
`;

const Equals = styled.span`
  display: flex;
  color: #ccc;
  font-size: 18px;
  margin-left: 20px;

  &:before {
    content: '=';
    top: -2px;
    position: relative;
  }
`;

const Definition = styled.div`
  margin-left: 20px;
  padding: 1px;
  width: 100%;
`;

const BlockQuote = styled.blockquote`
  display: flex;
  margin: 0;
  padding: 0;

  &:before {
    content: open-quote;
  }

  &:after {
    content: close-quote;
  }

  &:before,
  &:after {
    display: inline-block;
    vertical-align: bottom;
    color: #ccc;
    font-size: 22px;
    top: -4px;
    position: relative;
  }

  &:before {
    margin-right: 3px;
  }
`;

const Break = styled.div`
  flex-basis: 100%;
`;

const ExampleInput = styled(HighlightedInput)`
  padding-left: 20px;
  color: #ccc;
`;

const Comment = styled.div`
  height: 0;

  &:after {
    color: #ccc;
    content: '//';
    font-size: 14px;
    top: -4px;
    position: relative;
    display: inline-block;
  }
`;

const DefinitionInput = styled(HighlightedInput)`
  flex-basis: 100%;
  margin-bottom: 8px;
  border: 0;
  background: transparent;
`;

const FormatterTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 8px;
  border: 0;
  background: transparent;
`;

const SubmitButton = styled.input`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
  cursor: pointer;
`;

const AddNewRuleButton = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.colors.headerBackground};
  padding: 20px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 12px;
  flex-basis: 100%;
  margin-bottom: 10px;
`;
