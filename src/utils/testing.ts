import crypto from 'crypto-random-string';
/**
 * generate random string
 * @param min minimum length
 * @param max maximum length
 * @returns a string with length between min and max
 */
export function randomString(min = 1, max = 128) {
  return crypto({ length: randomInt(min, max) });
}

/** generate random integer number between min and max inclusive */
export function randomInt(min = 1, max = 128) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
