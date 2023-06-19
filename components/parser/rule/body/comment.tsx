import React, { useContext } from 'react';
import styled from 'styled-components';

import RuleContext from 'contexts/rule-context';

type RuleComponentProps = {
  comment: string;
};

const RuleComment: React.FC<RuleComponentProps> = ({ comment }) => {
  const { isEditMode, ruleForm } = useContext(RuleContext);
  const { register } = ruleForm;

  function trimInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.value = event.target.value.trim();
  }

  if (!isEditMode) {
    return (
      <Comment>
        {`// `}
        {comment}
      </Comment>
    );
  }

  return (
    <EditComment id="rule-comment-wrapper" htmlFor="comment">
      <Input
        {...register('comment')}
        id="comment"
        defaultValue={comment}
        name="comment"
        onBlur={trimInput}
        placeholder="comment"
        type="text"
      />
    </EditComment>
  );
};

export default RuleComment;

const Comment = styled.div`
  color: #ccc;
  margin-bottom: 6px;
`;

const LabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
`;

const Input = styled.input`
  padding: 0;
  color: #333;
  border: 0;
  background: transparent;
  margin-bottom: 8px;
  padding: 4px 6px;
  min-width: 50px;

  :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px
      ${({ theme }) => theme.colors.headerBackground} inset;
    -webkit-text-fill-color: #333;
  }
`;

const EditComment = styled(LabelWrapper)`
  margin-right: 10px;
`;
