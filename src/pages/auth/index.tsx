import { Button } from '@material-ui/core';
import React from 'react';
import createToken from '@utils/oauth';
import { AuthApi, createAuthApi } from '@services/api';
import { FirestoreAuth } from '@services/firebase';

export default function Authentication() {
  return (
    <Button variant="contained" color="primary" onClick={authorize}>
      Authorize
    </Button>
  );
}

function authorize() {
  const api = new AuthApi(createAuthApi(), new FirestoreAuth());
  api.authorize(createToken(), createToken());
}
