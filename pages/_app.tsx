import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Source_Sans_Pro } from '@next/font/google';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'styled-components';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import apolloClient from '../lib/apollo';
import { theme, GlobalStyle } from '../styles/theme';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  whyDidYouRender(React);
}

const sourceSansPro = Source_Sans_Pro({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  preload: true,
  display: 'fallback'
});

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
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <style jsx global>{`
            html {
              font-family: ${sourceSansPro.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
