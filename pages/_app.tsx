import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

import apolloClient from '../lib/apollo';
import { theme, GlobalStyle } from '../styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
