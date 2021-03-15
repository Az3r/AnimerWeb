/**
 * @jest-environment node
 */
import { createToken } from '@utils/oauth';
import { AuthApi, createAuthApi } from '@services/api';
import MockAdapter from 'axios-mock-adapter';
import { randomInt, randomString } from '@utils/testing';
import { FirestoreAuth } from '@services/firebase';
import { initializeTestApp } from '@firebase/rules-unit-testing';
import { keys } from '@utils/constants';
import { AccessTokenResponse } from '@services/interfaces';
import { updateUserAuth } from '@pages/callback/auth';

test('should be base64-url encoded', () => {
  const token = createToken();
  const regex = new RegExp(/^[\w-]+$/);
  expect(token).toMatch(regex);
});

test('should receive AccessTokenResponse object', async () => {
  const response = accessTokenResponse();
  const codeVerifier = createToken();

  const { api, mockAxios } = mockAuthApi();
  mockAxios.onPost('/token').reply(200, response);

  const data = await api.token(randomString(), codeVerifier);
  expect(data).toMatchObject(response);
});

test('should update auth document', async () => {
  // store user's token
  const token = accessTokenResponse();
  const state = createToken();
  const code = createToken();
  const result = {
    ...token,
    codeChallenge: createToken(),
    codeVerifier: createToken(),
  };
  const firestore = new FirestoreAuth(
    initializeTestApp({ projectId: keys.project }).firestore()
  );
  await firestore.create(state, result.codeVerifier, result.codeChallenge);

  const { api, mockAxios } = mockAuthApi();
  mockAxios.onPost('/token').reply(200, token);

  await updateUserAuth(state, code, firestore, api);
  const data = await firestore.get(state);
  expect(data).toMatchObject(result);
});

function accessTokenResponse(): AccessTokenResponse {
  return {
    access_token: createToken(),
    expires_in: randomInt(),
    token_type: randomString(),
    refresh_token: createToken(),
  };
}

function mockAuthApi() {
  const api = new AuthApi(createAuthApi());
  const mockAxios = new MockAdapter(api.api.axiosInstance);
  return {
    api,
    mockAxios,
  };
}
