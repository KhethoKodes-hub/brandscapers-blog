// client/src/services/api.js
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
});

/**
 * Automatically attach Firebase ID token to every request
 */
API.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
