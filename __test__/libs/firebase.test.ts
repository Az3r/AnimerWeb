/**
 * @jest-environment node
 */

import {
  clearFirestoreData,
  initializeTestApp,
} from '@firebase/rules-unit-testing';
import { randomAccessTokenResponse, randomString } from '@__test__/utils';
import { FirestoreAuth } from '@services/firebase';

const projectId = 'firebase-test-ts';
const firebase = initializeTestApp({ projectId });

beforeEach(async () => {
  await clearFirestoreData({ projectId });
});

afterAll(async () => {
  await firebase.delete();
});

describe('FirebaseAuth', () => {
  test('should create document', async () => {
    const { state, codeChallenge, codeVerifier } = randomData();

    const mock = new FirestoreAuth(firebase.firestore());
    await mock.create(state, codeVerifier, codeChallenge);

    const document = await mock.get(state);
    expect(document).toEqual({
      codeChallenge,
      codeVerifier,
    });
  });

  test('should fields merged', async () => {
    const { state, codeChallenge, codeVerifier, token } = randomData();

    const mock = new FirestoreAuth(firebase.firestore());
    await mock.create(state, codeVerifier, codeChallenge);
    await mock.update(state, token);

    const document = await mock.get(state);
    expect(document).toEqual({
      codeChallenge,
      codeVerifier,
      ...token,
    });
  });

  test('should new token be updated', async () => {
    const { state, token } = randomData();
    const mock = new FirestoreAuth(firebase.firestore());

    await mock.update(state, token);
    let document = await mock.get(state);
    expect(document).toMatchObject(token);

    const newToken = randomAccessTokenResponse();
    await mock.update(state, newToken);
    document = await mock.get(state);
    expect(document).toMatchObject(newToken);
  });
});

function randomData() {
  const state = randomString();
  const codeChallenge = randomString();
  const codeVerifier = randomString();
  const token = randomAccessTokenResponse();
  return { state, codeChallenge, codeVerifier, token };
}
