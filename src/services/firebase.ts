import firebase from 'firebase';
import 'firebase/firestore';
import { collections } from '@utils/constants';
import { AccessTokenResponse, AuthDocument } from './interfaces';

const config = {
  apiKey: 'AIzaSyBF08IhBpfeZNwydxeEDgC3SPj34tV3fJw',
  authDomain: 'my-anime-list-b213d.firebaseapp.com',
  projectId: 'my-anime-list-b213d',
  storageBucket: 'my-anime-list-b213d.appspot.com',
  messagingSenderId: '678597447127',
  appId: '1:678597447127:web:a14d2a90bdb4d2964bcf92',
  measurementId: 'G-LYRFLXMBVY',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
  if (process.env.NODE_ENV === 'development') {
    firebase.firestore().useEmulator('localhost', 8080);
  }
}

export const auth = {
  /**
   * store user's authorization token
   * @param state unique token used to retrieve code verifier and code challenge
   * @param codeVerifier 128-character base64-url encoded string
   * @param codeChallenge 128-character base64-url encoded string
   * @param token user's access token
   */
  create: async (
    state: string,
    codeVerifier: string,
    codeChallenge: string,
    token?: AccessTokenResponse
  ) => {
    await firebase
      .firestore()
      .collection(collections.auth)
      .doc(state)
      .set({
        codeVerifier,
        codeChallenge,
        ...token,
      });
  },
  /**
   * retrieve user's authorization token
   * @param state unique token used to retrieve code verifier and code challenge
   * @returns code verifier and code challenge
   */
  get: async (state: string) => {
    const snapshot = await firebase
      .firestore()
      .collection(collections.auth)
      .doc(state)
      .get();

    if (snapshot.exists) return snapshot.data() as AuthDocument;
    return Promise.reject(new Error('document does not exist'));
  },
};

export default firebase;
