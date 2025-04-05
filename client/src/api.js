// File: src/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const encryptText = (data, token) => API.post('/encryption/encrypt', data, {
  headers: { Authorization: token },
});
export const decryptText = (data, token) => API.post('/encryption/decrypt', data, {
  headers: { Authorization: token },
});