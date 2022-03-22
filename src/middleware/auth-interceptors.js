import axios from 'axios';
import store from '../store/index';
import router from '../router/router';
import { getToken } from '@/utils/localStorageTokens.utils.js';

const setup = () => {
  axios.interceptors.request.use(
    config => {
      const token = getToken('token');

      if (token) {
        config.headers.common.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => Promise.reject(error),
  );

  axios.interceptors.response.use(
    response => response,
    error => {
      const refreshToken = getToken('refreshToken');
      const code = error.response.status;
      if (code === 401 && refreshToken) {
        store.dispatch('auth/refreshToken').catch(() => {
          router.push({ name: 'auth' });
        });
      }
      return Promise.reject(error);
    },
  );
};

export default setup;
