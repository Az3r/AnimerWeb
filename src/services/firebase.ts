import firebase from 'firebase/app';
import { collections } from '@utils/constants';
import { AccessTokenResponse, AuthDocument } from '@services/interfaces';
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
  if (process.env.NODE_ENV !== 'production') {
    firebase.firestore().useEmulator('localhost', 8080);
  }
}

/** manage user's authorization in firestore */
class FirestoreAuth {
  private firestore: firebase.firestore.Firestore;

  constructor(firestore?: firebase.firestore.Firestore) {
    this.firestore = firestore || firebase.firestore();
  }

  /**
   * create user's initial authorization process
   * @param state unique token used to retrieve code verifier and code challenge
   * @param codeVerifier 128-character base64-url encoded string
   * @param codeChallenge 128-character base64-url encoded string
   */
  async create(state: string, codeVerifier: string, codeChallenge: string) {
    await this.firestore.collection(collections.auth).doc(state).set({
      codeVerifier,
      codeChallenge,
    });
  }

  /**
   * add access token to current authorization process,
   * will fail if doucment already had an access_token field
   * @param state unique token for each authorization process
   * @param token the access token retrieved from MAL authorization process
   */
  async update(state: string, token: AccessTokenResponse) {
    await this.firestore
      .collection(collections.auth)
      .doc(state)
      .set(token, { merge: true });
  }

  /**
   * retrieve user's authorization token
   * @param state unique token used to retrieve code verifier and code challenge
   * @returns code verifier and code challenge
   */
  async get(state: string) {
    const snapshot = await this.firestore
      .collection(collections.auth)
      .doc(state)
      .get();

    if (snapshot.exists) return snapshot.data() as AuthDocument;
    return Promise.reject(new Error('document does not exist'));
  }
}

export default firebase;
export { FirestoreAuth };
