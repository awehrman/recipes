import { ParserRuleDefinition } from '@prisma/client';
import _ from 'lodash';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';

type AutoWidthInputProps = {
  fieldName?: string;
  isRequired?: boolean;
  defaultValue?: string;
  definitionId?: string;
  definitionPath?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  grow?: boolean;
};

type WatchProps = {
  state: any; // TODO
  fieldName: string;
  getValues?: (str: string) => string | undefined;
  definitionId?: string | null;
};

const getFieldUpdates = ({
  definitionId = null,
  fieldName = '',
  state = {}
}: WatchProps): string | null => {
  const { definitions = [] } = state;

  // if this is a top-level field, we can directly get the values off the form
  if (!definitions.length) {
    return state[fieldName];
  }

  // otherwise we'll need to find the definition first, then the value
  const definition = definitions.find(
    (def: ParserRuleDefinition) => def.id === definitionId
  );

  return definition?.[fieldName];
};

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({
  fieldName = '',
  isRequired = false,
  defaultValue = '',
  definitionId = null,
  definitionPath = null,
  onBlur = _.noop(),
  placeholder = null,
  grow = false,
  ...props
}) => {
  const containerRef = useRef<HTMLLabelElement>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const sizeRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    state: { id, displayContext }
  } = useRuleContext();
  const {
    control,
    formState: { isDirty },
    register
  } = useFormContext();
  const formUpdates = useWatch({ control });

  const updatedFormValue = getFieldUpdates({
    definitionId,
    fieldName,
    state: formUpdates
  });
  const dirtyValue = !isDirty ? defaultValue : updatedFormValue;
  const displaySizePlaceholder =
    displayContext !== 'display' && !dirtyValue?.length
      ? placeholder
      : dirtyValue;
  const isSpellCheck = displayContext !== 'display';
  const isMounted =
    sizeRef?.current &&
    containerRef?.current &&
    fieldsetRef?.current &&
    canvasRef;
  // TODO put this in context or a prop
  const uniqueId = `${id}-${definitionPath ?? fieldName}`;

  const updateInputWidth = useCallback(() => {
    if (isMounted) {
      const width = sizeRef.current.offsetWidth;
      containerRef.current.style.width = `${width}px`;
      // TODO check if this is actually needed for top level fields or not
      // fieldsetRef.current.style.width = `${sizeRef.current.offsetWidth}px`;
    }
  }, [isMounted]);

  // TODO i want to move all of this width logic out of this component
  useLayoutEffect(() => {
    const timeoutId = setTimeout(updateInputWidth, 100);
    return () => clearTimeout(timeoutId);
  }, [containerRef, sizeRef, displaySizePlaceholder, updateInputWidth]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.visibility = 'hidden';
    canvas.style.position = 'absolute';
    canvas.style.fontSize = '14px';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    return () => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!!isMounted) {
      const { key } = event;
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const computedStyled = window.getComputedStyle(sizeRef.current);
          context.font = computedStyled.font;
          context.clearRect(0, 0, canvas.width, canvas.height);
          const keyWidth = context.measureText(key).width;
          const originalWidth = sizeRef.current.offsetWidth;
          const width = originalWidth + keyWidth;
          containerRef.current.style.width = `${width}px`;
        }
      }
    }
  }

  return (
    <Wrapper grow={grow} ref={fieldsetRef}>
      <Label ref={containerRef} id={`${fieldName}-label`} htmlFor={uniqueId}>
        <InputField
          {...register(definitionPath ?? fieldName, {
            required: isRequired,
            disabled: displayContext === 'display'
          })}
          id={uniqueId}
          autoComplete="off"
          className={`${displayContext}`}
          defaultValue={defaultValue}
          onKeyDown={handleOnKeyDown}
          placeholder={placeholder ?? fieldName}
          spellCheck={isSpellCheck}
          type="text"
          {...props}
        />
        {/* we'll let the span determine the width of our input */}
        <WidthTracker ref={sizeRef}>{displaySizePlaceholder}</WidthTracker>
      </Label>
    </Wrapper>
  );
};

export default AutoWidthInput;

type WrapperProps = {
  grow: boolean;
};

const Wrapper = styled.fieldset<WrapperProps>`
  border: 0;
  padding: 0;
  margin: 0;
  margin-right: 10px;
  // TODO uh does this still work?
  flex-grow: ${({ grow }) => (grow ? 1 : 0)};
  flex-wrap: nowrap;
`;

const WidthTracker = styled.span`
  display: inline;
  visibility: hidden;
  // border: 1px solid blue;
  // margin-left: 20px;
  white-space: pre;
`;

const Label = styled.label`
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 40px;
`;

const InputField = styled.input` 
  position: relative;
  padding: 4px 0;
  border-radius: 0;
  line-height: 1.2;
  color: #222;
  font-size: 14px;
  border: 0;
  outline: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  margin-bottom: 5px; /* you'll want at least the height of the span border */
  background-color: transparent;
  width: inherit;
  white-space: pre;

  &.edit, &.add {
    cursor: text;
		caret-color: #222;

    &:focus {
			outline: none !important;
  }

  &::placeholder {
    font-style: italic;
    color: #ccc;
  }
`;
