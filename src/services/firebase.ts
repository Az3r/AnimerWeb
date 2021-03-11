import firebase from 'firebase';
import 'firebase/firestore';

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
}

export const authenticate = {
  /**
   * store user's authorization token
   * @param state unique token used to retrieve code verifier and code challenge
   * @param codeVerifier 128-character base64-url encoded string
   * @param codeChallenge 128-character base64-url encoded string
   */
  create: async (
    state: string,
    codeVerifier: string,
    codeChallenge: string
  ) => {
    await firebase.firestore().collection('Authorization').doc(state).set({
      codeVerifier,
      codeChallenge,
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
      .collection('Authorization')
      .doc(state)
      .get();
    return snapshot.data();
  },
};

export default firebase;
