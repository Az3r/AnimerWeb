/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { dark, light } from '@styles/theme';
import { useCookies } from 'react-cookie';

export default function DefaultLayout({ children }: PropertyTypes) {
  const [cookies] = useCookies(['theme']);
  return (
    <ThemeProvider theme={cookies.theme === 'dark' ? dark : light}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
interface PropertyTypes {
  children?: JSX.Element;
}

DefaultLayout.defaultProps = {
  children: <div />,
};
