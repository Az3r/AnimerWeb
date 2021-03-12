import createToken from '@utils/oauth';

test('should be base64-url encoded', () => {
  const token = createToken();
  const regex = new RegExp(/^[\w-]+$/);
  expect(token).toMatch(regex);
});
