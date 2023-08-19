import { ParserRuleDefinition } from '@prisma/client';
import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

import { useRuleContext } from 'contexts/rule-context';
import useParserRule from 'hooks/use-parser-rule';

type RuleComponentProps = {
  definitionId: string; // TODO consider renaming to definitionId
};

const RuleComment: React.FC<RuleComponentProps> = ({ definitionId }) => {
  const {
    state: { id, displayContext }
  } = useRuleContext();
  const { rule } = useParserRule(id);
  const { register } = useFormContext();
  const { definitions = [] } = rule;
  const comment = definitions.find(
    (d: ParserRuleDefinition) => d.id === definitionId
  )?.comment;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  if (displayContext === 'display') {
    return (
      <Comment>
        {`// `}
        {comment}
      </Comment>
    );
  }

  return (
    <Wrapper>
      <EditComment htmlFor="definition.comment">
        <Input
          {...register(`definition[${definitionId}].comment`)}
          id="definition.comment"
          defaultValue={comment}
          name="definition.comment"
          onBlur={trimInput}
          placeholder="definition.comment"
          type="text"
        />
      </EditComment>
    </Wrapper>
  );
};

export default RuleComment;

const Comment = styled.div`
  color: #ccc;
  margin-bottom: 6px;
`;

const Wrapper = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  color: #ccc;
`;

const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0;
  color: #ccc;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  margin-left: 15px;
  width: 100%;

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.headerBackground} inset;
    -webkit-text-fill-color: #ccc;
  }
`;

const EditComment = styled(LabelWrapper)`
  position: relative;
  width: 100%;

  :before {
    content: '//';
    top: -2px;
    position: absolute;
  }
`;
