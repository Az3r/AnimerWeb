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

test('should receive AccessTokenResponse object with 2xx status code', async () => {
  const response = accessTokenResponse();
  const codeVerifier = createToken();

  const { api, mockAxios } = mockAuthApi();
  mockAxios.onPost('/token').reply(2 * 100 + randomInt(0, 99), response);

  const data = await api.token(randomString(), codeVerifier);
  expect(data).toMatchObject(response);
});

test('should fail when recieves invalid response data', async () => {
  const response = {
    random: 1,
    invalid: createToken(),
    data: '2',
  };
  const codeVerifier = createToken();

  const { api, mockAxios } = mockAuthApi();
  mockAxios.onPost('/token').reply(2 + randomInt(0, 99), response);

  const task = api.token(randomString(), codeVerifier);
  await expect(task).rejects.toThrow();
});

test('should fail when recieves status code other than 2xx', async () => {
  const hundreds = [1, 3, 4, 5];

  const { api, mockAxios } = mockAuthApi();

  const tasks = hundreds.map((hundred) => {
    const status = hundred * 100 + randomInt(0, 99);
    mockAxios.onPost('/token').reply(status, createToken());
    return api.token(randomString(), createToken());
  });

  tasks.forEach(async (task) => {
    await expect(task).rejects.toThrow();
  });
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
  const database = firestore();
  await database.create(state, result.codeVerifier, result.codeChallenge);

  const { api, mockAxios } = mockAuthApi();
  mockAxios.onPost('/token').reply(200, token);

  await updateUserAuth(state, code, database, api);
  const data = await database.get(state);
  expect(data).toMatchObject(result);
});

test('should open new window when user request authorization', async () => {
  Object.defineProperty(global, 'window', {
    value: { open: jest.fn() },
    writable: true,
  });
  const { api } = mockAuthApi();
  api.authorize(createToken(), createToken());
  expect(window.open).toBeCalled();
});

function firestore() {
  return new FirestoreAuth(
    initializeTestApp({ projectId: keys.project }).firestore()
  );
}

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
