import qs from 'qs';
import { ApisauceInstance, create } from 'apisauce';
import { AccessTokenResponse } from '@services/interfaces';

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
    baseURL: 'https://myanimelist.net/v1/oauth2/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 30000,
  });

/** an api instance used for MAL authorization endpoint */
class AuthApi {
  readonly api: ApisauceInstance;

  constructor(api?: ApisauceInstance) {
    if (api) this.api = api;
    else this.api = createAuthApi();
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

    const response = await this.api.post<AccessTokenResponse>(
      '/token',
      qs.stringify(data)
    );
    if (response.ok && response.data !== undefined) {
      return response.data;
    }
    return Promise.reject(response.originalError);
  }

  /**
   * open MAL authorization window
   * @param codeChallenge strong encrypted string
   * @param state comparision string when user goes to redirected url
   * @param responseType must be set to 'code'
   */
  authorize(codeChallenge: string, state: string, responseType = 'code') {
    const data = {
      response_type: responseType,
      client_id: process.env.NEXT_PUBLIC_MAL_CLIENT_ID,
      code_challenge: codeChallenge,
      state,
    };

    // open new window for user's authorization
    const url = `${this.api.getBaseURL()}authorize?${qs.stringify(data)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export { createDataApi, createAuthApi, AuthApi };
