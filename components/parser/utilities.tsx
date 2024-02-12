import React from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { PEG_CHARACTERS } from 'constants/parser';

import { formatEmbeddedList, isEmbeddedList } from './utils';

const defaultValue = `{
  function formatOutput(parsed = []) {
  const result = parsed
    .filter(Boolean)
    .map((p) => p.values)
    .join(' ');
  return result;
  }

  function getIngredients(parsed = []) {
    const result = parsed
      .filter((p) => p.type === 'ingredient')
        .map((p) => p.values)
    return result;
  }
}`;

const Utilities: React.FC = () => (
  <Wrapper>
    <Header>Utility Functions</Header>
    <Collapse>...</Collapse>
    <UtilityTextArea value={defaultValue} />
  </Wrapper>
);

export default Utilities;

const Wrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 600px;
`;

const Header = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  flex-basis: 90%;
`;

const Collapse = styled.div`
  flex-basis: 10%;
  align-self: flex-end;
  top: -20px;
  position: relative;
`;

const UtilityTextArea = styled.textarea`
  font-size: 12px;
  font-color: #222;
  max-width: 600px;
  width: 100%;
  min-height: 200px;
  border: 0;
  background: ${({ theme }) => theme.colors.headerBackground};
  font-family: monospace;
`;

const generateEmbeddedList = (ruleString: string): React.ReactNode => {
  const embeddedListKey = v4();
  const formattedListString = formatEmbeddedList(ruleString);
  return <RuleList key={embeddedListKey}>{formattedListString}</RuleList>;
};

// TODO return type
const generateUnlabeledRule = (
  ruleString: string = '',
  ruleNames: string[] = []
): React.ReactNode[] => {
  const components: React.ReactNode[] = [];
  // TODO use a constant here
  const instances = ruleString.split(/([*!+$|()[\]])/).filter(Boolean);
  instances.forEach((name, index) => {
    const isSpecialCharacter = PEG_CHARACTERS.find((char) => char === name);
    const keyRoot = `${v4()}-${index}`;
    const isMissingRule = !ruleNames.includes(name) && !isSpecialCharacter;
    if (isMissingRule) {
      components.push(
        <MissingRule key={`missing-${keyRoot}-${name}`}>{name}</MissingRule>
      );
    }

    const isDefinedRule = ruleNames.includes(name) && !isSpecialCharacter;
    if (isDefinedRule && !isMissingRule) {
      components.push(
        <DefinedRule key={`defined-${keyRoot}-${name}`}>{name}</DefinedRule>
      );
    }

    if (!isDefinedRule && !isMissingRule) {
      components.push(
        <SplitPiece key={`piece-${keyRoot}-${name}`}>{name}</SplitPiece>
      );
    }
  });

  return components;
};

const generateLabeledRule = (
  ruleString: string = '',
  ruleNames: string[] = []
): React.ReactNode[] => {
  const components: React.ReactNode[] = [];
  const [label, rule] = ruleString.split(':');
  const key = v4();
  const unlabeledComponents = generateUnlabeledRule(rule, ruleNames);
  components.push(<Label key={`label-${key}`}>{label}:</Label>);
  components.push(<Rule key={key}>{[...unlabeledComponents]}</Rule>);

  return components;
};

export const generateParsedRule = (
  ruleString: string = '',
  ruleNames: string[] = []
): React.ReactNode[] => {
  const components: React.ReactNode[] = [];
  const isList = isEmbeddedList(ruleString);

  if (isList) {
    const embeddedList = generateEmbeddedList(ruleString);
    components.push(embeddedList);

    return components;
  }

  const rules = ruleString.split(' ');
  rules.forEach((ruleInstance) => {
    const isUnlabeledRule = !ruleInstance.includes(':');
    if (isUnlabeledRule) {
      const unlabeledRule = generateUnlabeledRule(ruleInstance, ruleNames);
      components.push([...unlabeledRule]);
    } else {
      const labeledRule = generateLabeledRule(ruleInstance, ruleNames);
      components.push([...labeledRule]);
    }
  });

  return components.flatMap((c) => c);
};

const Label = styled.label`
  margin-right: 2px;
`;

const Rule = styled.span`
  margin-right: 2px;
  font-weight: 600;
`;

const MissingRule = styled.span`
  color: tomato;
  font-weight: 600;
`;

const SplitPiece = styled.span`
  font-weight: 400;
`;

const DefinedRule = styled.span`
  color: ${({ theme }) => theme.colors.highlight};
`;

const RuleList = styled.span``;
