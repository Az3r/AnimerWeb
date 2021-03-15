import React from 'react';
import { Switch, Container, Button } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import { FirestoreAuth } from '@services/firebase';
import { createToken } from '@utils/oauth';
import { AuthApi } from '@services/api';

export default function HomePage(): JSX.Element {
  const [cookies, setCookie] = useCookies(['theme']);
  return (
    <Container>
      <Switch checked={cookies.theme === 'dark'} onChange={onThemeChanged} />
      <Button variant="contained" color="primary" onClick={() => authorize()}>
        I am a button
      </Button>
    </Container>
  );

  function onThemeChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const theme = event.target.checked ? 'dark' : 'light';
    setCookie('theme', theme);
  }
}

export async function authorize(
  firestore = new FirestoreAuth(),
  api = new AuthApi()
) {
  // store user's token
  const state = createToken();
  const codeChallenge = createToken();
  await firestore.create(state, codeChallenge, codeChallenge);

  // request MAL authoirzation
  api.authorize(state, codeChallenge);
}
