import { Button } from '@material-ui/core';
import React from 'react';
import createToken from '@utils/oauth';

export default function Authentication() {
  return (
    <Button variant="contained" color="primary" onClick={authorize}>
      Authorize
    </Button>
  );
}

async function authorize() {
  const responseType = '?response_type=code';
  const clientID = `&client_id=${process.env.NEXT_PUBLIC_MAL_CLIENT_ID}`;
  const codeChallenge = `&code_challenge=${createToken()}`;
  const state = `&state=${createToken()}`;

  const url = `https://myanimelist.net/v1/oauth2/authorize${responseType}${clientID}${codeChallenge}${state}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
