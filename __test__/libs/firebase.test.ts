/**
 * @jest-environment node
 */

import { collections } from '@utils/constants';
import { assertSucceeds } from '@firebase/rules-unit-testing';
import {
  createMockFirestoreAuth,
  firestore,
  randomAccessTokenResponse,
  randomString,
} from '@__test__/utils';

describe('FirebaseAuth', () => {
  test('should create document', async () => {
    const { state, codeChallenge, codeVerifier } = randomData();

    const database = firestore();
    const mock = createMockFirestoreAuth();
    await mock.create(state, codeVerifier, codeChallenge);

    const task = database.collection(collections.auth).doc(state).get();
    await assertSucceeds(task);
    const document = await task;
    expect(document.data()).toMatchObject({
      codeChallenge,
      codeVerifier,
    });
  });

  test('should update if document does not have access_token field', async () => {
    const { state, codeChallenge, codeVerifier, token } = randomData();

    const database = firestore();
    const mock = createMockFirestoreAuth();
    await mock.create(state, codeVerifier, codeChallenge);
    await mock.update(state, token);

    const task = database.collection(collections.auth).doc(state).get();
    await assertSucceeds(task);
    const document = await task;
    expect(document.data()).toMatchObject({
      codeChallenge,
      codeVerifier,
      ...token,
    });
  });
});

function randomData() {
  const state = randomString();
  const codeChallenge = randomString();
  const codeVerifier = randomString();
  const token = randomAccessTokenResponse();
  return { state, codeChallenge, codeVerifier, token };
}
