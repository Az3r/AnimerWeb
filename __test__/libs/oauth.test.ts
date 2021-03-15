/**
 * @jest-environment node
 */
import { createToken } from '@utils/oauth';
import { AuthApi, createAuthApi } from '@services/api';
import MockAdapter from 'axios-mock-adapter';
import { AccessTokenResponse } from '@interfaces/services';
import { randomInt, randomString } from '@utils/testing';

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

test('should update auth document after receive access token', async () => {});

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
