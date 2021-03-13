/**
 * @jest-environment node
 */

import {
  clearFirestoreData,
  assertFails,
  initializeTestApp,
  apps,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import crypto from 'crypto-random-string';
import { keys, collections } from '@utils/constants';

beforeEach(async () => {
  await clearFirestoreData({ projectId: keys.project });
});

afterAll(async () => {
  await Promise.all(apps().map((app) => app.delete()));
});

test('should not allow access to arbitrary collection except specified ones', async () => {
  const database = firestore();
  const collection = crypto({ length: random() });
  const document = crypto({ length: random() });
  const reference = database.collection(collection).doc(document);
  await assertFails(reference.get());
});

test('should allow access to specific collections', async () => {
  const { auth } = collections;
  const database = firestore();
  const document = crypto({ length: random() });
  await assertSucceeds(database.collection(auth).doc(document).get());
});

describe('authorization collection', () => {
  test('should not be modifiable if document already had an "access_token" field', async () => {
    const database = firestore();
    const document = database.collection(collections.auth).doc();
    await assertSucceeds(document.set({ access_token: 'crypted_token' }));
    await assertFails(document.set({ random_field: 'random value' }));
  });

  test('should be able to delete document without any conditions', async () => {
    const database = firestore();
    const document = database.collection(collections.auth).doc();
    await assertSucceeds(document.set({ access_token: 'crypted_token' }));
    await assertSucceeds(document.delete());
  });
});

/** generate random integer number between min and max inclusive */
function random(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function firestore() {
  return initializeTestApp({ projectId: keys.project }).firestore();
}
