import random from 'crypto-random-string';

/**
 * generate code verifier string with the length of 128 characters
 * @returns a base64url string
 */
export default function createToken(): string {
  return random({ length: 128, type: 'base64' })
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
