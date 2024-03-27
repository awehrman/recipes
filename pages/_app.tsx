import React from 'react';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'styled-components';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import apolloClient from '../lib/apollo';
import { theme, GlobalStyle, sourceSansPro } from '../styles/theme';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  whyDidYouRender(React);
}

// type Metric = {
//   id: string;
//   name: string;
//   startTime: string;
//   value: string;
//   label: string;
// };

// export function reportWebVitals(metric: Metric) {
//   console.log(metric);
// }

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <main className={sourceSansPro.className} id="main-app">
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </main>
      </SessionProvider>
    </ApolloProvider>
  );
}
