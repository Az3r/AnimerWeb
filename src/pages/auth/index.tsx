import { Button } from '@material-ui/core';
import React from 'react';
import { createToken } from '@utils/oauth';
import { AuthApi, createAuthApi } from '@services/api';
import { FirestoreAuth } from '@services/firebase';

export default function Authentication() {
  return (
    <Button variant="contained" color="primary" onClick={authorize}>
      Authorize
    </Button>
  );
}

async function authorize() {
  // store user's token
  const state = createToken();
  const codeChallenge = createToken();
  const firestore = new FirestoreAuth();
  await firestore.create(state, codeChallenge, codeChallenge);

  // request MAL authoirzation
  const api = new AuthApi(createAuthApi());
  api.authorize(state, codeChallenge);
}
