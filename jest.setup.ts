import { clearFirestoreData, apps } from '@firebase/rules-unit-testing';
import { keys } from '@utils/constants';
import '@testing-library/jest-dom';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
afterAll(async () => {
  await Promise.all(apps().map((app) => app.delete()));
});

afterEach(async () => {
  await clearFirestoreData({ projectId: keys.project });
});
