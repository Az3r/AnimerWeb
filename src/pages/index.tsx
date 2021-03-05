import React from 'react';
import { Switch, Container, Button } from '@material-ui/core';
import { useCookies } from 'react-cookie';

export default function HomePage(): JSX.Element {
  const [cookies, setCookie] = useCookies(['theme']);
  const [toggleDarkTheme, setToggleDarkTheme] = React.useState(
    cookies.theme === 'dark'
  );
  return (
    <Container>
      <Switch value={toggleDarkTheme} onChange={onThemeChanged} />
      <Button variant="contained" color="primary">
        I am a button
      </Button>
    </Container>
  );

  function onThemeChanged() {
    const dark = !toggleDarkTheme;
    const theme = dark ? 'dark' : 'light';
    setCookie('theme', theme);
    setToggleDarkTheme(dark);
  }
}
