/* eslint-disable import/no-extraneous-dependencies */
import { initializeTestApp } from '@firebase/rules-unit-testing';
import { AuthApi, createAuthApi } from '@services/api';
import { FirestoreAuth } from '@services/firebase';
import { AccessTokenResponse } from '@services/interfaces';
import { createToken } from '@utils/oauth';
import MockAdapter from 'axios-mock-adapter';
import crypto from 'crypto-random-string';

export const keys = {
  project: 'my-anime-list-b213d',
};
/**
 * generate random string
 * @param min minimum length
 * @param max maximum length
 * @returns a string with length between min and max
 */
export function randomString(min = 1, max = 128) {
  return crypto({ length: randomInt(min, max) });
}

/** generate random integer number between min and max inclusive */
export function randomInt(min = 1, max = 128) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function firestore() {
  return initializeTestApp({ projectId: keys.project }).firestore();
}

export function randomAccessTokenResponse(): AccessTokenResponse {
  return {
    access_token: createToken(),
    expires_in: randomInt(),
    token_type: randomString(),
    refresh_token: createToken(),
  };
}

export function createMockAuthApi() {
  const api = new AuthApi(createAuthApi());
  const mockAxios = new MockAdapter(api.api.axiosInstance);
  return {
    api,
    mockAxios,
  };
}

export function createMockFirestoreAuth() {
  return new FirestoreAuth(firestore());
}
