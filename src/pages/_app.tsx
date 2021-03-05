/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import DefaultLayout from '@components/layout';

export default function MainApp(properties: AppProps) {
  const { Component, pageProps } = properties;
  return (
    <CookiesProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </CookiesProvider>
  );
}
