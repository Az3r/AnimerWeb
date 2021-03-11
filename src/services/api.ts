import qs from 'qs';
import { create } from 'apisauce';

const dataApi = create({
  baseURL: 'https://api.myanimelist.net/v2',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const authApi = create({
  baseURL: ' https://myanimelist.net/v1/oauth2/',
  headers: {
    'Content-Type': 'application/x-www.form-urlencoded',
  },
  timeout: 30000,
});

const authenticate = {
  token: async (
    code: string,
    codeVerifier: string,
    grantType = 'authorization_code'
  ) => {
    const data = {
      client_id: process.env.NEXT_PUBLIC_MAL_CLIENT_ID,
      client_secret: process.env.MAL_CLIENT_SECRET,
      code,
      code_verifier: codeVerifier,
      grant_type: grantType,
    };

    const response = await authApi.post('/token', qs.stringify(data));
    if (response.ok) {
      return response.data;
    }
    return Promise.reject(response);
  },

  authorize: (
    clientId: string,
    codeChallenge: string,
    state: string,
    responseType = 'code'
  ) => {
    const data = {
      response_type: responseType,
      client_id: clientId,
      code_challenge: codeChallenge,
      state,
    };
    const url = `${authApi.getBaseURL()}authorize?${qs.stringify(data)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  },
};

export { authenticate };
export default dataApi;
