import React, { useContext, useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

const HighlightedInput = ({
  className = '',
  fieldName = '',
  fullWidth = true,
  isEditMode = false,
  isRequired = false,
  isSpellCheck = false,
  loading = false,
  registerField = {},
  defaultValue = '',
  ...props
}) => {
  const size = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLLabelElement>(null);
  const {
    ruleForm: { control, setValue, trigger }
  } = useContext(RuleContext);
  const level = 'default';
  const watchName: string = useWatch({
    control,
    name: fieldName,
    defaultValue
  });
  const trimmedValue = (watchName?.length ? watchName : defaultValue)?.replace(
    / /g,
    '\u00a0'
  );
  const adjustedClassName = `${isEditMode ? 'editable' : ''} ${className}`;

  useEffect(() => {
    if (fullWidth) {
      // this is such a hack, but it fixes the initial width issue
      const interval = setInterval(() => {
        const container = containerRef?.current;
        if (container && size?.current) {
          container.style.width = `${size.current?.offsetWidth}px`;
          container.style.maxWidth = `${size.current?.offsetWidth}px`;
          container.style.maxWidth = `${size.current?.offsetWidth}px`;
        }
        clearInterval(interval);
      }, 50);

      return () => {
        clearInterval(interval);
      };
    }
  }, [fullWidth, watchName]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    if (fullWidth) {
      const container = containerRef?.current;
      if (container && size?.current) {
        container.style.width = `${size.current?.offsetWidth}px`;
        container.style.maxWidth = `${size.current?.offsetWidth}px`;
        container.style.maxWidth = `${size.current?.offsetWidth}px`;
      }
    }
  }, [containerRef, fullWidth, size, watchName]);

  return (
    <Label ref={containerRef} id={`${fieldName}-label`} htmlFor={fieldName}>
      <InputField
        aria-busy={loading}
        autoComplete="off"
        className={adjustedClassName}
        disabled={!isEditMode}
        defaultValue={defaultValue}
        id={fieldName}
        level={level}
        name={fieldName}
        required={isRequired}
        spellCheck={isSpellCheck}
        type="text"
        {...registerField}
        {...props}
      />

      <InputHighlight className={adjustedClassName} level={level} ref={size}>
        {trimmedValue}
      </InputHighlight>
    </Label>
  );
};

export default HighlightedInput;

const highlightHash = {
  error: 'red',
  warning: 'orange',
  default: '#222'
};

const Label = styled.label`
  margin: 0;
  padding: 0;
  border: 0;
`;

type InputProps = {
  level: 'error' | 'warning' | 'default';
};

const InputField = styled.input<InputProps>`
  position: relative;
  width: inherit;
  min-width: 0px;
  padding: 4px 0;
  border-radius: 0;
  line-height: 1.2;
  color: ${({ level }) => highlightHash?.[level] ?? `#222`};
  font-size: 14px;
  border: 0;
  outline: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  margin-bottom: 5px; /* you'll want at least the height of the span border */
  background-color: transparent;

  &::placeholder {
    font-style: italic;
    color: #ccc;
  }

  &.editable {
    cursor: text;
		caret-color: #222;

    &:focus {
			outline: none !important;
  }
`;

const InputHighlight = styled.span<InputProps>`
  font-size: 14px;
  user-select: none;
  line-height: 1.2;
  position: absolute;
  height: 0;
  color: transparent;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  overflow: hidden;
  width: auto;
`;
