// TODO deprecate and move to /rule/add

import js_beautify from 'js-beautify';
import { capitalize } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useForm, useWatch, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { Button } from 'components/common';
import usePEGParser from 'hooks/use-peg-parser';

const defaultValues = {
  id: v4(),
  name: '',
  label: '',
  definitions: [
    {
      id: v4(),
      example: '',
      formatter: '',
      order: 0,
      rule: ''
    }
  ]
};

type RulesProps = {
  showNewRuleForm: boolean;
  setShowNewRuleForm: any;
};

type Definition = {
  id: string;
  example: string;
  formatter: string;
  order: number;
  rule: string;
};

type Rule = {
  id: string;
  name: string;
  label: string;
  definitions: Definition[];
};

const formatterPlaceholder = `{
  return {
    rule: '#1_rule_name',
    type: 'rule_type',
    values
  };
}`;

function createLabel(value: string) {
  const words = value.split(/(?=[A-Z])/);
  return words.map((v: string) => capitalize(v)).join(' ');
}

const AddNewRule: React.FC<RulesProps> = ({
  showNewRuleForm,
  setShowNewRuleForm
}) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  const { addRule } = usePEGParser();
  const { control, handleSubmit, register, reset, setValue, watch } =
    useForm<Rule>({ defaultValues });
  const ruleName = watch('name');
  const ruleDefinitions = useWatch({
    control,
    name: 'definitions',
    defaultValue: []
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'definitions'
  });

  // TODO move into a hook
  const adjustTextAreaHeight = useCallback(() => {
    ruleDefinitions.forEach((_field, index) => {
      const textarea = document.getElementById(
        `definitions.${index}.formatter`
      );
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [ruleDefinitions]);

  useEffect(() => {
    adjustInputWidth();
  }, [ruleName]);

  useEffect(() => {
    adjustTextAreaHeight();
  }, [adjustTextAreaHeight, ruleDefinitions]);

  useEffect(() => {
    const label = createLabel(ruleName);
    setValue('label', label);
  }, [ruleName, setValue]);

  function adjustInputWidth() {
    const inputElement = document.getElementById('name');
    const value = (inputElement as HTMLInputElement)?.value?.length ?? 0;
    const wrapperElement = document.getElementById('new-rule-name-wrapper');

    if (inputElement && wrapperElement) {
      inputElement.style.width = `${value}ch`;
      wrapperElement.style.width = `${value}ch`;
    }
  }

  function handleNewRuleButtonClick() {
    setShowNewRuleForm(true);
  }

  function handleAddNewDefinitionClick() {
    append(defaultValues.definitions);
  }

  function onSubmit(data: Rule) {
    addRule(data, reset, setShowNewRuleForm);
  }

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  function formatTextArea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.target.value = js_beautify(event.target.value, { indent_size: 2 });
  }

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
      <Header>Add New Rule</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Top>
          <RuleName id="new-rule-name-wrapper" htmlFor="name">
            <Input
              {...register('name')}
              id="name"
              defaultValue={defaultValues.name}
              name="name"
              onBlur={trimInput}
              placeholder="name"
              type="text"
            />
          </RuleName>

          <RuleLabel htmlFor="label">
            <Input
              {...register('label')}
              id="label"
              defaultValue={defaultValues.label}
              name="label"
              onBlur={trimInput}
              placeholder="Rule Name"
              type="text"
            />
          </RuleLabel>
        </Top>

        <Definitions>
          {fields.map((field, index) => (
            <Definition key={field.id}>
              <Order htmlFor={`definitions.${index}.order`}>
                <Input
                  {...register(`definitions.${index}.order`)}
                  key={field.id}
                  id={`definitions.${index}.order`}
                  name={`definitions.${index}.order`}
                  defaultValue={field.order}
                  type="number"
                />
              </Order>

              <Example htmlFor={`definitions.${index}.example`}>
                <Input
                  {...register(`definitions.${index}.example`)}
                  key={field.id}
                  id={`definitions.${index}.example`}
                  defaultValue={field.example}
                  name={`definitions.${index}.example`}
                  onBlur={trimInput}
                  placeholder="example"
                  type="text"
                />
              </Example>

              <Rule htmlFor={`definitions.${index}.rule`}>
                <Input
                  {...register(`definitions.${index}.rule`)}
                  id={`definitions.${index}.rule`}
                  defaultValue={field.rule}
                  name={`definitions.${index}.rule`}
                  onBlur={trimInput}
                  placeholder="rule definition"
                  type="text"
                />
              </Rule>

              <Formatter htmlFor={`definitions.${index}.formatter`}>
                <TextArea
                  {...register(`definitions.${index}.formatter`)}
                  id={`definitions.${index}.formatter`}
                  defaultValue={field.formatter}
                  name={`definitions.${index}.formatter`}
                  onBlur={formatTextArea}
                  placeholder={formatterPlaceholder}
                />
              </Formatter>
            </Definition>
          ))}
        </Definitions>
        <Buttons>
          <AddNewDefinitionButton
            label="Add Definition"
            onClick={handleAddNewDefinitionClick}
            type="button"
          />
          <SubmitButton type="submit" value="Submit" />
        </Buttons>
      </Form>
    </Wrapper>
  );
};

export default AddNewRule;

const Top = styled.div`
  display: flex;
  flex-basis: 100%;
`;

const Definition = styled.div`
  :not(:first-child) {
    border-top: 1px solid #ccc;
    padding-top: 10px;
  }
`;

const AddNewRuleButton = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.altGreen};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const AddNewDefinitionButton = styled(Button)`
  border: 0;
  background: ${({ theme }) => theme.colors.highlight};
  font-weight: 600;
  color: #fff;
  padding: 4px 6px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.headerBackground};
  padding: 20px;
  max-width: 600px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  flex-basis: 100%;
  margin-bottom: 10px;
  font-color: #222;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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

const TextArea = styled.textarea`
  padding: 0;
  color: #333;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  padding: 4px 6px;
  width: 100%;
  height: 200px;
`;

const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
`;

const RuleName = styled(LabelWrapper)`
  margin-right: 10px;
`;

const RuleLabel = styled(LabelWrapper)`
  flex-grow: 2;
`;

const Buttons = styled.div`
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
`;

const Definitions = styled.div`
  padding-left: 20px;
  margin-bottom: 20px;
  flex-basis: 100%;
`;

const Order = styled(LabelWrapper)`
  display: none;
`;

const Example = styled(LabelWrapper)`
  position: relative;
  margin-left: 6px;
  padding-left: 10px;

  input {
    color: #ccc;
  }

  &:before {
    color: #ccc;
    content: '//';
    font-size: 14px;
    height: 0;
    margin-left: -10px;
  }
`;

const Rule = styled(LabelWrapper)`
  flex-basis: 100%;
`;

const Formatter = styled(LabelWrapper)`
  flex-basis: 100%;
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
