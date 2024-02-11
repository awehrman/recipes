import { javascript } from '@codemirror/lang-javascript';
import * as events from '@uiw/codemirror-extensions-events';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { js_beautify } from 'js-beautify';
import _ from 'lodash';
import React, { useCallback } from 'react';
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

const RuleFormatter: React.FC<any> = ({
  control,
  getValues,
  register,
  setValue
}) => {
  const {
    state: { index, defaultValue, definitionId }
  } = useRuleDefinitionContext();
  const {
    state: { id, displayContext },
  } = useRuleContext();

  const fieldName = `definitions.${index}.formatter`;
  const { rule } = useParserRule(id);
  const { name = '' } = rule;
  // TODO fix param type
  const type = useCallback((rule: any): string => {
    // TODO types
    if (displayContext === 'display') {
      const defaultType = (rule?.definitions ?? [])?.[index].type;
      return defaultType;
    }
    return useWatch({ control, name: `definitions.${index}.type` });
  }, [displayContext]);
  const showField = type(rule) === 'RULE';

  const watchedName = useCallback((defaultName: string) => {
    if (displayContext === 'display') {
      return defaultName;
    }
    // TODO this may require a bit more scrutiny
    return useWatch({ name: 'name', defaultValue: name });
  }, [displayContext]);

  const defaultFormatter = getDefaultFormatter(watchedName(name));
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
    const isOptimisticAdd = definitionId.includes(`OPTIMISTIC`);
    if (displayContext === 'edit') {
      return !isOptimisticAdd ? value : defaultComputedValue;
    }
    const formattedWithOrder = insertOrder(`${value}`, index);
    return formattedWithOrder;
  }

  const extensions = [javascript({ jsx: true }), handleOnBlur];
  const editorProps = useCallback(() => ({
    ref: editorRef,
    basicSetup: formatterSetup,
    editable: displayContext !== 'display',
    extensions: extensions,
    height: "auto",
    // indentWithTab,
    onChange: handleOnChange,
    placeholder: displayContext === 'display' ? '' : '/* format rule return */',
    readOnly: displayContext === 'display',
    theme: themeOptions[displayContext as ThemeOptionKey],
    width: "525px",
    value: currentValue,
  }), [displayContext, currentValue]);

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
        {/* TODO this is a focus trap */}
        <StyledEditor
          {...editorProps()}
        />
      </EditFormatter>
    </Wrapper>
  );
};

export default RuleFormatter;

RuleFormatter.whyDidYouRender = true;

const Wrapper = styled.div`
  position: relative;
  min-height: 31px;
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
