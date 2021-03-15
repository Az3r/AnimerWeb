import React from 'react';

import { FirestoreAuth } from '@services/firebase';
import { AuthApi } from '@services/api';
import { GetServerSideProps } from 'next';

export default async function AuthCallback() {
  return <div />;
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const state = query.state as string;
  const code = query.code as string;
  await updateUserAuth(state, code);
  return {
    props: {},
  };
};

export async function updateUserAuth(
  state: string,
  code: string,
  firestore = new FirestoreAuth(),
  api = new AuthApi()
) {
  const { codeVerifier } = await firestore.get(state);
  const token = await api.token(code, codeVerifier);
  await firestore.update(state, token);
}
