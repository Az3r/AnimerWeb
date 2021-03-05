import React from 'react';
import { Switch, Container, Button } from '@material-ui/core';
import { useCookies } from 'react-cookie';

export default function HomePage(): JSX.Element {
  const [cookies, setCookie] = useCookies(['theme']);
  return (
    <Container>
      <Switch checked={cookies.theme === 'dark'} onChange={onThemeChanged} />
      <Button variant="contained" color="primary">
        I am a button
      </Button>
    </Container>
  );

  function onThemeChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const theme = event.target.checked ? 'dark' : 'light';
    setCookie('theme', theme);
  }
}
