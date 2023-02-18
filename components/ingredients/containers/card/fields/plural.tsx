import React, { useContext } from 'react';
import pluralize from 'pluralize';
import styled from 'styled-components';

import useIngredient from 'hooks/use-ingredient';
import CardContext from 'contexts/card-context';
import MagicIcon from 'public/icons/magic.svg';

import { Button } from '../../../../common';
import HighlightedInput from './common/highlighted-input';
import { localFields } from './common/validation';

const Plural = () => {
  const {
    formState,
    id,
    isEditMode,
    methods: { register, setValue }
  } = useContext(CardContext);
  const { ingredient, loading } = useIngredient({ id });
  const { plural } = ingredient;
  const isPluralSuggestEnabled = isEditMode;

  function handleAutoSuggest() {
    const singularName = formState?.name ?? ingredient?.name ?? '';
    const pluralName = pluralize.plural(singularName);
    if (pluralName !== singularName) {
      setValue('plural', pluralName);
    }
  }

  const registerField = register('plural', {
    validate: {
      validateLocalFields: (data: string) =>
        localFields(data, 'plural', formState, ingredient)
      // validateAllIngredients,
    }
  });

  return (
    <Wrapper aria-busy={loading} disabled={loading}>
      {isPluralSuggestEnabled && (
        <AutoSuggest icon={<MagicIcon />} onClick={handleAutoSuggest} />
      )}
      <HighlightedInput
        className={isPluralSuggestEnabled ? 'auto-suggest' : ''}
        defaultValue={plural}
        fieldName="plural"
        isEditMode={isEditMode}
        isSpellCheck={isEditMode}
        loading={loading}
        placeholder="plural"
        registerField={registerField}
      />
    </Wrapper>
  );
};

export default Plural;

const Wrapper = styled.fieldset`
  display: flex;
  order: 3;
  flex-basis: 50%;

  span.auto-suggest {
    margin-right: 10px;
  }
`;

const AutoSuggest = styled(Button)`
  border: 0;
  padding: 0;
  margin-right: 10px;
  background: transparent;
  display: inline-block;
  cursor: pointer;

  svg {
    display: inline-block;
    width: 13px;
  }
`;
