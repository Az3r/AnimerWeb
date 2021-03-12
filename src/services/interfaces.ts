export interface AuthDocument {
  codeChallenge: string;
  codeVerifier: string;
}

export interface AccessTokenResponse {
  /** always set to "Bearer". */
  token_type: string;
  /** expiration time of the Access Token (expressed in seconds). */
  expires_in: number;
  access_token: string;
  refresh_token: string;
}
