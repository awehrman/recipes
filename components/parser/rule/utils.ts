import { ParserRuleDefinition } from '@prisma/client';

import { removeTypename } from 'hooks/helpers/parser-rule';
import { getDefaultRuleValuesForIndex } from 'contexts/rule-context';

// TODO fix type
export const saveRule = ({
  data,
  order,
  displayContext,
  reset,
  updateRule,
  dispatch,
  addRule,
  parserDispatch
}: any) => {
  const { payload, input } = createInput({ data, order });

  if (displayContext === 'edit') {
    reset({ ...input });
    updateRule(input);
    dispatch({ type: 'UPDATE_FORM_STATE', payload });
  } else if (displayContext === 'add') {
    addRule(input);
    dispatch({
      type: 'RESET_DEFAULT_VALUES',
      payload: getDefaultRuleValuesForIndex(0)
    });
  }

  // TODO on success only? where to handle validation?
  // seems like these should happen on update
  parserDispatch({ type: 'SET_IS_ADD_BUTTON_DISPLAYED', payload: true });
  dispatch({ type: 'SET_DISPLAY_CONTEXT', payload: 'display' });
};

// TODO continue to give a fuck about types wehrman
const createInput = ({ data, order }: any) => {
  // TODO we'll probably pass this explicitly in, but for now just throw it at the bottom
  if (data.order === 'undefined' || data.order === null) {
    data.order = order;
  }

  if (data?.listItemEntryValue) {
    delete data.listItemEntryValue;
  }

  const input = removeTypename(data);
  return {
    input,
    payload: data
  }
};

// TODO this is probably a shitty data format so come back and think this through
export const getAllParserRuleDefinitionNames = (definitions = []) => [
  ...new Set(
    definitions
      .map((def: ParserRuleDefinition) => `${def.rule}`)
      .filter((def: string) => !!def.length)
  )
];