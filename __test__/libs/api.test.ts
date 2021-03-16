/**
 * @jest-environment node
 */
import { createToken } from '@utils/oauth';
import {
  randomInt,
  randomString,
  randomAccessTokenResponse,
  createMockAuthApi,
} from '@__test__/utils';

describe('AuthApi', () => {
  test('should be base64-url encoded', () => {
    const token = createToken();
    const regex = new RegExp(/^[\w-]+$/);
    expect(token).toMatch(regex);
  });

  test('should receive AccessTokenResponse object with 2xx status code', async () => {
    const response = randomAccessTokenResponse();
    const codeVerifier = createToken();

    const { api, mockAxios } = createMockAuthApi();
    mockAxios.onPost('/token').reply(2 * 100 + randomInt(0, 99), response);

    const data = await api.token(randomString(), codeVerifier);
    expect(data).toEqual(response);
  });

  test('should fail when recieves invalid response data', async () => {
    const response = {
      random: 1,
      invalid: createToken(),
      data: '2',
    };
    const codeVerifier = createToken();

    const { api, mockAxios } = createMockAuthApi();
    mockAxios.onPost('/token').reply(2 + randomInt(0, 99), response);

    const task = api.token(randomString(), codeVerifier);
    await expect(task).rejects.toThrow();
  });

  test('should fail when recieves status code other than 2xx', async () => {
    const hundreds = [1, 3, 4, 5];

    const { api, mockAxios } = createMockAuthApi();

    const tasks = hundreds.map((hundred) => {
      const status = hundred * 100 + randomInt(0, 99);
      mockAxios.onPost('/token').reply(status, createToken());
      return api.token(randomString(), createToken());
    });

    tasks.forEach(async (task) => {
      await expect(task).rejects.toThrow();
    });
  });

  test('should return exact AccessTokenResponse', async () => {
    // store user's token
    const token = randomAccessTokenResponse();
    const state = createToken();
    const code = createToken();

    const { api, mockAxios } = createMockAuthApi();
    mockAxios.onPost('/token').reply(200, token);
    const result = await api.token(state, code);

    expect(result).toEqual(token);
  });

  test('should open new window when user request authorization', async () => {
    Object.defineProperty(global, 'window', {
      value: { open: jest.fn() },
      writable: true,
    });
    const { api } = createMockAuthApi();
    api.authorize(createToken(), createToken());
    expect(window.open).toBeCalled();
  });
});
