import { js_beautify, HTMLBeautifyOptions } from 'js-beautify';
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

type TestsProps = {
  tests: TestProps[];
};

type TestProps = {
  reference: string;
  parsed: boolean;
  expected: ExpectedProps[];
  details?: DetailsProps;
  error?: {
    message?: string;
  };
};

type DetailsProps = {
  rule?: string;
  type?: string;
  values?: DetailsProps[];
};

type ExpectedProps = {
  type: string;
  value: string;
};

type TestComponentProps = {
  test: TestProps;
};

type TestWrapperProps = {
  parsed: boolean;
};

const options: HTMLBeautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  max_preserve_newlines: 1,
  preserve_newlines: true,
  indent_scripts: 'normal',
  end_with_newline: false,
  wrap_line_length: 110
};

const Test: React.FC<TestComponentProps> = ({ test }) => {
  const [showTestDetails, setShowTestDetails] = useState(false);
  function handleDetailsToggle() {
    setShowTestDetails(!showTestDetails);
  }

  return (
    <TestWrapper parsed={test.parsed} onClick={handleDetailsToggle}>
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
                  {js_beautify(`${value.values}`, options)}
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

const Tests: React.FC<TestsProps> = ({ tests }) => {
  function renderTests() {
    return tests.map((test) => (
      <Test key={`test-${test.reference}`} test={test} />
    ));
  }

  return <Wrapper>{renderTests()}</Wrapper>;
};

export default Tests;

const TestWrapper = styled.div<TestWrapperProps>`
  font-size: 14px;
  color: ${({ parsed }) => (parsed ? 'MediumSeaGreen' : 'tomato')};

  &:hover {
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  flex-basis: calc(30% - 40px);
  margin-left: 40px;
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
