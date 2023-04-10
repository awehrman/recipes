import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import React, { useState } from 'react';
import styled from 'styled-components';

import AngleUpIcon from 'public/icons/angle-up.svg';
import AngleDownIcon from 'public/icons/angle-down.svg';
import DeleteIcon from 'public/icons/trash-can.svg';
import PlusIcon from 'public/icons/plus.svg';

type DefinitionProps = {
  id: string;
  example: string;
  definition: string;
  formatter?: string;
};

type RuleProps = {
  id: string;
  name: string;
  label: string;
  definitions: DefinitionProps[];
};

type RuleComponentProps = {
  deleteRule: (id: string) => void;
  register: any;
  rule: RuleProps;
};

const options: HTMLBeautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 5,
  preserve_newlines: true,
  // keep_array_indentation: false,
  // break_chained_methods: false,
  indent_scripts: 'normal',
  // brace_style: 'collapse',
  // space_before_conditional: false,
  // unescape_strings: false,
  // jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: 0,
  indent_inner_html: false,
  // comma_first: false,
  // e4x: false,
  indent_empty_lines: false
};

const Rule: React.FC<RuleComponentProps> = ({ deleteRule, register, rule }) => {
  const [showRule, setShowRule] = useState(true);
  const [showAddDefinitionForm, setShowAddDefinitionForm] = useState(false);

  function handleContainerClick() {
    setShowRule(!showRule);
  }

  function handleOnDeleteClick() {
    deleteRule(rule.id);
  }

  function handleAddNewDefinitionClick() {
    setShowAddDefinitionForm(true);
  }

  return (
    <Wrapper>
      <Top onClick={() => handleContainerClick()}>
        <Name defaultValue={rule.name} {...register(`${rule.id}-name`)} />
        <Label defaultValue={rule.label} {...register(`${rule.id}-label`)} /> =
        {!showRule ? (
          <AngleUpIcon width="12px" fill="#ccc" />
        ) : (
          <AngleDownIcon width="12px" fill="#ccc" />
        )}
      </Top>
      {showRule &&
        (rule?.definitions ?? []).map((def: DefinitionProps) => (
          <Definition key={`${rule.id}-definition`}>
            {'// '}
            <Comment
              defaultValue={def.example}
              {...register(`${rule.id}-definition-${def.id}-example`)}
            />

            <RuleDefinition
              defaultValue={def.definition}
              {...register(`${rule.id}-definition-${def.id}-definition`)}
            />
            {def?.formatter && (
              <Formatter
                defaultValue={js_beautify(def.formatter, options)}
                {...register(`${rule.id}-definition-${def.id}-formatter`)}
              />
            )}
            {!showAddDefinitionForm && (
              <PlusIcon
                fill={({ theme }: any) => theme.colors.highlight}
                onClick={handleAddNewDefinitionClick}
              />
            )}
            <DeleteIcon onClick={handleOnDeleteClick} />
          </Definition>
        ))}
      {showAddDefinitionForm && (
        <>
          <Slash>/</Slash>
          <AddDefinitionForm>
            <Definition>
              {'// '}
              <Comment
                defaultValue=""
                placeholder="one gram"
                {...register(`${rule.id}-definition-new-example`)}
              />
              <RuleDefinition
                defaultValue=""
                placeholder="amt: amount unit: unit"
                {...register(`${rule.id}-definition-new-definition`)}
              />
              <Formatter
                defaultValue=""
                placeholder="{ return ''; }"
                {...register(`${rule.id}-definition-new-formatter`)}
              />
              {/* <PlusIcon onClick={handleAddNewDefinitionClick} />
              <DeleteIcon onClick={handleOnDeleteClick} /> */}
            </Definition>
          </AddDefinitionForm>
        </>
      )}
    </Wrapper>
  );
};

export default Rule;

const Slash = styled.div`
  margin: 10px;
  margin-right: 0;
  padding: 6px 10px;
  font-size: 12px;
  background: ${({ theme }) => theme.colors.headerBackground};
  width: 100%;
`;

const AddDefinitionForm = styled.div`
  margin: 0px 0;
`;

const Top = styled.div`
  flex-basis: 100%;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
  margin-bottom: 4px;
  color: #909497;
  font-size: 14px;
  position: relative;
  cursor: pointer;

  svg {
    position: absolute;
    right: 0;
  }
`;

const Name = styled.input`
  margin-right: 20px;
  color: ${({ theme }) => theme.colors.highlight};
  border: 0;
  padding: 0;
`;

const Label = styled.input`
  margin-right: 5px;
  border: 0;
  padding: 0;
`;

const Definition = styled.div`
  margin-left: 20px;
  font-size: 14px;
  max-width: 600px;
  color: #ccc;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 20px;

  svg {
    cursor: pointer;
    height: 12px;
    width: 12px;
    padding: 0;
    float: right;
    margin-top: 10px;
    fill: ${({ theme }) => theme.colors.highlight};

    &:last-child {
      fill: tomato;
      right: 0;
      position: absolute;
      bottom: 0;
    }
  }
`;

const Comment = styled.input`
  color: #ccc;
  margin-bottom: 8px;
  border: 0;
  padding: 0;
  padding-left: 4px;
  padding-top: 2px;
  flex: 1;
  position: relative;
`;

const RuleDefinition = styled.input`
  color: #222;
  margin-bottom: 10px;
  font-weight: 600;
  border: 0;
  padding: 0;
  flex-basis: 100%;
`;

const Formatter = styled.textarea`
  font-size: 12px;
  color: #909497;
  margin: 0;
  background: rgba(128, 174, 245, 0.15);
  padding: 8px;
  width: 100%;
  height: 130px;
  border: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 20px;
  max-width: 600px;
`;
