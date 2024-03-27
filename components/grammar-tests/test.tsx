import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

import { TestComponentProps, TestWrapperProps } from './types';

const Test: React.FC<TestComponentProps> = ({ test, loading }) => {
  const [showTestDetails, setShowTestDetails] = useState(false);

  function handleDetailsToggle() {
    setShowTestDetails(!showTestDetails);
  }

  return (
    <TestWrapper
      isLoading={loading}
      parsed={test.parsed}
      onClick={handleDetailsToggle}
    >
      {test.reference}
      {showTestDetails && test.parsed ? (
        <Details>
          <DetailsLine>
            <Label>rule: </Label>
            {test?.details?.rule ?? ''}
          </DetailsLine>
          <DetailsLine>
            <Label>type: </Label>
            {test?.details?.type ?? ''}
          </DetailsLine>
          <DetailsLine>
            <Label>values: </Label>
            {(test?.details?.values ?? []).map((value) => (
              <div key={v4()}>
                <NestedDetailsLine>
                  <Label>rule: </Label>
                  {value.rule ?? ''}
                </NestedDetailsLine>
                <NestedDetailsLine>
                  <Label>type: </Label>
                  {value.type ?? ''}
                </NestedDetailsLine>
                <NestedDetailsLine>
                  <Label>values: </Label>
                  {`${JSON.stringify(value.values, null, 2)}`}
                </NestedDetailsLine>
              </div>
            ))}
          </DetailsLine>
        </Details>
      ) : null}
      {showTestDetails && !test.parsed ? (
        <Details>
          <DetailsLine>
            <Label>message: </Label>
            {test?.error?.message ?? ''}
          </DetailsLine>
        </Details>
      ) : null}
    </TestWrapper>
  );
};

export default Test;

const TestWrapper = styled.div<TestWrapperProps>`
  font-size: 14px;
  color: ${({ parsed, isLoading }) => {
    if (isLoading) {
      return '#222';
    }
    return parsed ? 'MediumSeaGreen' : 'tomato';
  }};

  &:hover {
    cursor: pointer;
  }
`;

const Details = styled.div`
  background: ${({ theme }) => theme.colors.headerBackground};
  padding: 8px;
  margin: 4px 0;
`;

const DetailsLine = styled.div`
  margin-bottom: 4px;
`;

const NestedDetailsLine = styled.div`
  margin-bottom: 4px;
  margin-left: 16px;
`;

const Label = styled.span`
  font-weight: 600;
`;
