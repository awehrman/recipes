import { ApolloConsumer } from '@apollo/client';
import { signIn, useSession } from 'next-auth/react';
import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import Button from './common/button';
import Header from './header';
import Nav from './nav';

export type PageProps = {
  title: string;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ title, children }) => {
  const { data: session } = useSession();
  const themeContext = useContext(ThemeContext);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ApolloConsumer>
      {(client) => (
        <>
          <Canvas theme={themeContext}>
            {!session ? (
              <SignIn label="Sign In" onClick={() => signIn('github')} />
            ) : (
              <Wrapper theme={themeContext} isExpanded={isExpanded}>
                <Nav isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                <Header title={title} />
                <Content client={client}>{children}</Content>
              </Wrapper>
            )}
          </Canvas>
        </>
      )}
    </ApolloConsumer>
  );
};

export default Page;

const SignIn = styled(Button)`
  text-decoration: none;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.altGreen};
  background: transparent;
  font-weight: bold;
  padding: 10px;
  border-radius: 12px;
  border: 0;
  position: fixed; /* or absolute */
  top: 40%;
  left: 50%;

  &:hover,
  &:focus {
    cursor: pointer;
    outline: 2px dotted ${({ theme }) => theme.colors.altGreen};
    color: white;
    background: rgba(45, 78, 71, 0.7);
  }
`;

const Canvas = styled.div`
  position: absolute;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.menuBackground};
`;

type ContentProps = {
  client: unknown;
};

const Content = styled.article<ContentProps>`
  padding: 20px 40px;
  background: ${({ theme }) => theme.colors.headerBackground};
  min-height: 100vh;
  color: ${({ theme }) => theme.colors.bodyText};
  font-size: 16px;
  font-family: 'Source Sans Pro', Verdana, sans-serif;
`;

type WrapperProps = {
  isExpanded: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  overflow-x: scroll;
  position: relative;
  top: ${({ theme }) => theme.sizes.minMenuWidth};
  left: 0;
  transition: 0.2s ease-out;
  width: 100%;
  height: 100%;

  section {
    padding: 20px 40px;
    background: white;
  }

  @media (min-width: ${({ theme }) => theme.sizes.tablet}) {
    top: 0;
    left: ${({ theme, isExpanded }) =>
      isExpanded ? theme.sizes.menuWidth : theme.sizes.minMenuWidth};
    width: calc(100% - 40px);
  }
`;
