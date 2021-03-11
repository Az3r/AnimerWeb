import { Button } from '@material-ui/core';
import React from 'react';
import createToken from '@utils/oauth';
import { authenticate } from '@services/api';

export default function Authentication() {
  return (
    <Button variant="contained" color="primary" onClick={authorize}>
      Authorize
    </Button>
  );
}

function authorize() {
  authenticate.authorize(
    process.env.NEXT_PUBLIC_MAL_CLIENT_ID as string,
    createToken(),
    createToken()
  );
}
