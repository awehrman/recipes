import { javascript } from '@codemirror/lang-javascript';
import * as events from '@uiw/codemirror-extensions-events';
import CodeMirror, {
  ViewUpdate,
  Statistics,
  EditorState,
  EditorView
} from '@uiw/react-codemirror';
import { js_beautify } from 'js-beautify';
import _ from 'lodash';
import React, { forwardRef, memo, useCallback, useEffect } from 'react';
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

type CodeMirrorElement = {
  editor: HTMLDivElement | undefined;
};

// TODO revisit focus trap
// ugh i hate this component; i can't track down why this constantly
// has the need to re-render the entire CodeMirror gizmo and it can cause jank
// on auto height rows
const MemoizedEditor = memo(
  forwardRef((props, ref: React.ForwardedRef<CodeMirrorElement>) => (
    <StyledEditor {...props} ref={ref} />
  ))
);
MemoizedEditor.whyDidYouRender = true;

const RuleFormatter: React.FC = memo(() => {
  const { control, getValues, register, setValue } = useFormContext();
  const {
    state: { index, defaultValue, definitionId }
  } = useRuleDefinitionContext();
  const {
    state: { id, displayContext }
  } = useRuleContext();

  const fieldName = `definitions.${index}.formatter`;
  const { rule } = useParserRule(id);
  const { name = '' } = rule;

  const watchedType = useWatch({ control, name: `definitions.${index}.type` });
  const type =
    displayContext === 'display'
      ? (rule?.definitions ?? [])?.[index].type
      : watchedType;
  const showField = type === 'RULE';

  const watchedName = useWatch({ name: 'name', defaultValue: name });
  const defaultFormatter = getDefaultFormatter(
    displayContext === 'display' ? watchedName : name
  );
  const formattedWithOrder = insertOrder(`${defaultValue.formatter}`, index);
  const uniqueId = `${id}-${fieldName}`;
  const defaultComputedValue =
    displayContext === 'display' ? formattedWithOrder : defaultFormatter;
  const currentValue = getEditorValue();

  const editorRef = React.useRef<CodeMirrorElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

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
    const isOptimisticAdd = definitionId.includes('OPTIMISTIC');
    if (displayContext === 'edit') {
      return !isOptimisticAdd ? value : defaultComputedValue;
    }
    const formattedWithOrder = insertOrder(`${value}`, index);
    return formattedWithOrder;
  }

  const extensions = [javascript({ jsx: true }), handleOnBlur];
  const editorProps = useCallback(
    () => ({
      ref: editorRef,
      basicSetup: formatterSetup,
      editable: displayContext !== 'display',
      extensions: extensions,
      height: 'auto',
      // indentWithTab,
      onChange: handleOnChange,
      placeholder:
        displayContext === 'display' ? '' : '/* format rule return */',
      readOnly: displayContext === 'display',
      theme: themeOptions[displayContext as ThemeOptionKey],
      width: '480px',
      value: currentValue
    }),
    [displayContext, currentValue, extensions]
  );

  if (
    (displayContext === 'display' && formattedWithOrder.length === 0) ||
    !showField
  ) {
    return null;
  }

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
        {/* {displayContext === 'display' ? (
          <DisplayFormatter>{defaultComputedValue}</DisplayFormatter>
        ) : ( */}
        <MemoizedEditor {...editorProps()} />
      </EditFormatter>
    </Wrapper>
  );
});

export default RuleFormatter;

RuleFormatter.whyDidYouRender = true;

// TODO we loose all our cute auto formatting with this but oh well
// const DisplayFormatter = styled.div`
//   font-size: 12px;
//   font-family: Menlo, Monaco, 'Courier New', monospace;
//   font-weight: 400;
//   white-space: pre-line;
// `;

const Wrapper = styled.div`
  position: relative;
  margin-top: 6px;
  cursor: text;
`;

const EditFormatter = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  position: relative;
  cursor: text;
`;

const HiddenFormInput = styled.textarea`
  display: none;
`;

const StyledEditor = styled(CodeMirror)`
  * {
    font-size: 12px;
    font-family: Menlo, Monaco, 'Courier New', monospace;
    font-weight: 400;
  }
`;
