/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import App, { AppProps, AppContext } from 'next/app';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { CookiesProvider } from 'react-cookie';
import { dark, light } from '@styles/theme';

export default function MainApp({
  Component,
  pageProps,
  theme,
}: PropertyTypes) {
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme === 'light' ? light : dark}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CookiesProvider>
  );
}

MainApp.getInitialProps = async (context: AppContext) => {
  const properties = await App.getInitialProps(context);
  const cookie = context.ctx.req?.headers.cookie;
  const theme = cookie?.includes('theme=dark') ? 'dark' : 'light';
  return {
    pageProps: properties.pageProps,
    theme,
  };
};

interface PropertyTypes extends AppProps {
  theme: string;
}
