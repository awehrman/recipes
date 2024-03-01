import React, { useContext, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import styled from 'styled-components';

import CardContext from 'contexts/card-context';

type ErrorsProps = {
  [fieldName: string]: {
    type: string;
  };
};

const getHighlightLevel = (
  errors: ErrorsProps,
  fieldName: string
): 'default' | 'error' | 'warning' => {
  const hasWarning = errors?.[fieldName]?.type === 'validateAllIngredients';
  const hasError = errors?.[fieldName]?.type === 'validateLocalFields';

  if (!hasWarning && !hasError) {
    return 'default';
  }

  return hasError ? 'error' : 'warning';
};

const HighlightedInput = ({
  className = '',
  fieldName = '',
  isEditMode = false,
  isRequired = false,
  isSpellCheck = false,
  loading = false,
  registerField = {},
  defaultValue = '',
  ...props
}) => {
  const {
    methods: {
      control,
      trigger,
      formState: { errors }
    }
  } = useContext(CardContext);
  const watchName = useWatch({ control, name: fieldName, defaultValue });
  const trimmedValue = (watchName?.length ? watchName : defaultValue)?.replace(
    / /g,
    '\u00a0'
  );
  const level = getHighlightLevel(errors as ErrorsProps, fieldName);
  const adjustedClassName = `${isEditMode ? 'editable' : ''} ${className}`;

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <Wrapper className={className}>
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

      <InputHighlight className={adjustedClassName} level={level}>
        {trimmedValue}
      </InputHighlight>
    </Wrapper>
  );
};

export default HighlightedInput;

const highlightHash = {
  error: 'red',
  warning: 'orange',
  default: '#222'
};

const Wrapper = styled.div`
  max-width: 100%;
  min-width: 90%;
`;

type InputProps = {
  level: 'error' | 'warning' | 'default';
};

const InputField = styled.input<InputProps>`
  position: relative;
  width: 100%;
  min-width: 100%;
  padding: 4px 0;
  border-radius: 0;
  line-height: 1.2;
  color: ${({ level }) => highlightHash?.[level] ?? '#222'};
  font-size: 1em;
  border: 0;
  outline: 0;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  margin-bottom: 5px; /* you'll want at least the height of the span border */
  background-color: transparent;

  &::placeholder {
    font-style: italic;
    color: #ccc;
  }

  &.list {
    border-bottom: 3px solid ${({ theme }) => theme.colors.headerBackground};
  }

  &.editable {
    cursor: text;
		caret-color: #222;

    &:focus {
			outline: none !important;

			& + span {
				border-top: 3px solid ${({ level, theme }) =>
          highlightHash?.[level] ?? theme.colors.altGreen};
			}
  }
`;

const InputHighlight = styled.span<InputProps>`
  font-size: 1em;
  user-select: none;
  line-height: 1.2;
  position: absolute;
  left: 0;
  top: 27px; /* 19 (height of input) + 4x (padding) */
  height: 0;
  color: transparent;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
  overflow: hidden;

  &.auto-suggest {
    left: 23px;
  }
`;
