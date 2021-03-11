import { create } from 'apisauce';

const api = create({
  baseURL: 'https://api.myanimelist.net/v2',
  headers: {
    Accept: 'application/json',
  },
  timeout: 30000,
});

export default api;
