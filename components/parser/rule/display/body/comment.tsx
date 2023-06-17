import React, { useState } from 'react';
import styled from 'styled-components';

type RuleComponentProps = {
  comment: string;
};

const RuleComment: React.FC<RuleComponentProps> = ({ comment }) => {
  return (
    <Comment>
      {`// `}
      {comment}
    </Comment>
  );
};

export default RuleComment;

const Comment = styled.div`
  color: #ccc;
  margin-bottom: 6px;
`;
