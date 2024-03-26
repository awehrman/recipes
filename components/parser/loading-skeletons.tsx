import React from 'react';
import styled from 'styled-components';

const LoadingSkeletons = () => {
  const placeholderItems = Array.from({ length: 5 }).map((_, index) => {
    const width = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey:
      <LoadingRow key={`parser-rule-placeholder-${index}`}>
        <LoadingName width={width} />
        <LoadingLabel width={width * 1.2} />
      </LoadingRow>
    );
  });

  return <LoadingWrapper>{placeholderItems}</LoadingWrapper>;
};

export default LoadingSkeletons;

const LoadingWrapper = styled.div`
  margin-top: 10px;
`;

const LoadingRow = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
`;

type LoadingProps = {
  width?: number;
};

const LoadingName = styled.div<LoadingProps>`
  background: ${({ theme }) => theme.colors.headerBackground};
  height: 13px;
  border-radius: 5px;
  margin-right: 20px;
  width: ${({ width }) => `${width}px` || 'auto'};
`;

const LoadingLabel = styled.div<LoadingProps>`
  background: ${({ theme }) => theme.colors.headerBackground};
  height: 13px;
  width: ${({ width }) => `${width}px` || 'auto'};
  border-radius: 5px;
`;
