/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { CookiesProvider, useCookies } from 'react-cookie';
import { dark, light } from '@styles/theme';

export default function MainApp(properties: AppProps) {
  return (
    <CookiesProvider>
      <ThemeComponent {...properties} />
    </CookiesProvider>
  );
}

function ThemeComponent({ Component, pageProps }: AppProps) {
  const [cookies] = useCookies(['theme']);

  return (
    <ThemeProvider theme={cookies.theme === 'dark' ? dark : light}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
