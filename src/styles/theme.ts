import { createMuiTheme } from '@material-ui/core';

export const light = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#ff88d9',
    },
    secondary: {
      main: '#1976d2',
    },
  },
});

export const dark = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
