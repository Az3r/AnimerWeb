import qs from 'qs';
import { ApisauceInstance, create } from 'apisauce';
import { FirestoreAuth } from '@services/firebase';
import { AccessTokenResponse } from '@interfaces/services';

const createDataApi = () =>
  create({
    baseURL: 'https://api.myanimelist.net/v2',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

const createAuthApi = () =>
  create({
    baseURL: ' https://myanimelist.net/v1/oauth2/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 30000,
  });

/** an api instance used for MAL authorization endpoint */
class AuthApi {
  api: ApisauceInstance;

  firestoreAuth: FirestoreAuth;

  constructor(api: ApisauceInstance, firestoreAuth: FirestoreAuth) {
    this.api = api;
    this.firestoreAuth = firestoreAuth;
  }

  /**
   *
   * @param code Authorisation Code needed to obtain an Access Token for the user.
   * @param codeVerifier the state value passed when authorzing user
   * @param grantType always be set to  "authorization_code"
   * @returns {AccessTokenResponse} access token object
   */
  async token(
    code: string,
    codeVerifier: string,
    grantType = 'authorization_code'
  ): Promise<AccessTokenResponse> {
    const data = {
      client_id: process.env.NEXT_PUBLIC_MAL_CLIENT_ID,
      client_secret: process.env.MAL_CLIENT_SECRET,
      code,
      code_verifier: codeVerifier,
      grant_type: grantType,
    };

    const response = await this.api.post('/token', qs.stringify(data));
    if (response.ok) return response.data as AccessTokenResponse;
    return Promise.reject(response.data);
  }

  async authorize(codeChallenge: string, state: string, responseType = 'code') {
    const data = {
      response_type: responseType,
      client_id: process.env.NEXT_PUBLIC_MAL_CLIENT_ID,
      code_challenge: codeChallenge,
      state,
    };
    // store authorization token
    await this.firestoreAuth.create(state, codeChallenge, codeChallenge);
    // open new window for user's authorization
    const url = `${this.api.getBaseURL()}authorize?${qs.stringify(data)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export { createDataApi, createAuthApi, AuthApi };
