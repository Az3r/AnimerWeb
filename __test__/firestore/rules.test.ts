/**
 * @jest-environment node
 */

import {
  assertFails,
  initializeTestApp,
  assertSucceeds,
  clearFirestoreData,
} from '@firebase/rules-unit-testing';
import crypto from 'crypto-random-string';
import { collections } from '@utils/constants';

const projectId = 'rules-test-ts';
const firebase = initializeTestApp({ projectId });

beforeEach(async () => {
  await clearFirestoreData({ projectId });
});

afterAll(async () => {
  await firebase.delete();
});

describe('/auths collection', () => {
  test('should not allow access to arbitrary collection except specified ones', async () => {
    const database = firebase.firestore();
    const collection = crypto({ length: random() });
    const document = crypto({ length: random() });
    const reference = database.collection(collection).doc(document);
    await assertFails(reference.get());
  });

  test('should allow access to specific collections', async () => {
    const { auth } = collections;
    const database = firebase.firestore();
    const document = crypto({ length: random() });
    await assertSucceeds(database.collection(auth).doc(document).get());
  });

  describe('authorization collection', () => {
    test('should read and write auths collections', async () => {
      const database = firebase.firestore();
      const document = database.collection(collections.auth).doc();
      await assertSucceeds(document.get());
      await assertSucceeds(document.set({ access_token: 'crypted_token' }));
      await assertSucceeds(document.delete());
    });
  });
});

/** generate random integer number between min and max inclusive */
function random(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
