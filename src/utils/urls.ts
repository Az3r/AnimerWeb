const url =
  process.env.NODE_ENV === 'production'
    ? 'https://animer-web.vercel.app/'
    : 'http://localhost:3000/';

export default url;
