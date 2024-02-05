import { javascript } from '@codemirror/lang-javascript';
import * as events from '@uiw/codemirror-extensions-events';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { js_beautify } from 'js-beautify';
import _ from 'lodash';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { ThemeOptionKey } from 'components/parser/types';
import { getDefaultFormatter } from 'components/parser/utils';
import { BEAUTIFY_OPTIONS } from 'constants/parser';
import { useRuleContext } from 'contexts/rule-context';
import { useRuleDefinitionContext } from 'contexts/rule-definition-context';
import useParserRule from 'hooks/use-parser-rule';

import { formatterSetup, themeOptions } from './formatter.theme';

// TODO move
const insertOrder = (value: string, index: number) => {
  return value.replace(/\${ORDER}/g, index.toString());
};

function getEditorHeight(element: HTMLDivElement | undefined): number {
  if (!element) {
    if (!element) {
      return 0;
    }
  }
  return element.getBoundingClientRect()?.height ?? 0;
}

type CodeMirrorElement = {
  editor: HTMLDivElement | undefined;
}
const RuleFormatter: React.FC = () => {
  const {
    state: { index, defaultValue, definitionId }
  } = useRuleDefinitionContext();
  const {
    state: { id, displayContext },
    setSize
  } = useRuleContext();
  const { control, getValues, register, setValue } = useFormContext();
  const type = useWatch({ control, name: `definitions.${index}.type` });
  const showField = type === 'RULE';
  const fieldName = `definitions.${index}.formatter`;
  const { rule } = useParserRule(id);
  const { name = '' } = rule;
  const watchedName = useWatch({ name: 'name', defaultValue: name });

  const defaultFormatter = getDefaultFormatter(watchedName);
  const formattedWithOrder = insertOrder(`${defaultValue.formatter}`, index);
  const uniqueId = `${id}-${fieldName}`;
  const defaultComputedValue =
    displayContext === 'display' ? formattedWithOrder : defaultFormatter;
  const currentValue = getEditorValue();
  const editorRef = React.useRef<CodeMirrorElement>();
  const editorHeight = getEditorHeight(editorRef?.current?.editor);
  const wrapperRef = React.useRef();

  function handleOnChange(value: string, _viewUpdate: ViewUpdate) {
    setValue(fieldName, value);
  }

  const handleOnBlur = events.content({
    blur: () => {
      const value = getValues(fieldName);
      const formatted = js_beautify(value, BEAUTIFY_OPTIONS);
      if (value !== formatted) {
        setValue(fieldName, formatted);
      }
    }
  });

  function getEditorValue() {
    const value = getValues(fieldName) ?? '';
    if (displayContext === 'add') {
      return value.length > 0 ? value : defaultComputedValue;
    }
    const isOptimisticAdd = definitionId.includes(`OPTIMISTIC`);
    if (displayContext === 'edit') {
      return !isOptimisticAdd ? value : defaultComputedValue;
    }
    const formattedWithOrder = insertOrder(`${value}`, index);
    return formattedWithOrder;
  }

  if (
    (displayContext === 'display' && !formattedWithOrder?.length) ||
    !showField
  ) {
    return null;
  }

  React.useEffect(() => {
    if (wrapperRef?.current && editorHeight > 0) {
      (wrapperRef.current as HTMLDivElement).style.height = `${editorHeight}px`;
      // rule header + height of comment and rule (18 + 52)
      // TODO this is likely insufficient
      console.log(index, editorHeight);
      const ruleHeight = 81 + editorHeight;
      // TODO why is my index always 0?
      // no i'm being dumb, this index is the rule definition index...
      // i 
      setSize();
    }
  }, [editorHeight]);

  return (
    <Wrapper ref={wrapperRef}>
      <EditFormatter htmlFor={uniqueId}>
        <HiddenFormInput
          {...register(fieldName)}
          id={uniqueId}
          defaultValue={defaultComputedValue}
          disabled={displayContext === 'display'}
          name={fieldName}
          placeholder={
            displayContext === 'display' ? '' : '/* format rule return */'
          }
        />
        {/* TODO this is a focus trap */}
        <StyledEditor
          ref={editorRef}
          basicSetup={formatterSetup}
          editable={displayContext !== 'display'}
          extensions={[javascript({ jsx: true }), handleOnBlur]}
          height="auto"
          indentWithTab
          onChange={handleOnChange}
          placeholder={
            displayContext === 'display' ? '' : '/* format rule return */'
          }
          readOnly={displayContext === 'display'}
          theme={themeOptions[displayContext as ThemeOptionKey]}
          width="525px"
          value={currentValue}
        />
      </EditFormatter>
    </Wrapper>
  );
};

export default RuleFormatter;

// RuleFormatter.whyDidYouRender = true;

const Wrapper = styled.div`
  position: relative;
`;

const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const HiddenFormInput = styled.textarea`
  display: none;
`;

const EditFormatter = styled(LabelWrapper)`
  margin-right: 10px;
  margin-top: 6px;
  position: relative;
`;

const StyledEditor = styled(CodeMirror)`
  * {
    font-size: 12px;
    font-family: Menlo, Monaco, 'Courier New', monospace;
    font-weight: 400;
  }
`;
