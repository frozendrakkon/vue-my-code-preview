import { getToken, setToken, removeToken } from '@/utils/localStorageTokens.utils.js';
import apiService from '@/services/api-service.js';

const state = {
  tokenData: {
    token: getToken('token'),
    refreshToken: getToken('refreshToken'),
  },
};

const mutations = {
  authSuccess(state, tokenData) {
    state.tokenData = tokenData;
    setToken('token', tokenData.token);
    setToken('refreshToken', tokenData.refreshToken);
  },
  removeTokens(state) {
    state.tokenData.token = null;
    state.tokenData.refreshToken = null;
    removeToken('token');
    removeToken('refreshToken');
  },
  loginError(state) {
    state.tokenData.token = null;
    removeToken('token');
  },
};

const getters = {
  getTokens(state) {
    return state.tokenData;
  },
};

const actions = {
  async loginAuth({ commit }, payload) {
    try {
      const response = await apiService.login(payload);
      commit('authSuccess', response.data);
      return Promise.resolve();
    } catch (err) {
      commit('loginError');
      return Promise.reject(err);
    }
  },
  async refreshToken({ state, commit }) {
    const refreshToken = state.tokenData.refreshToken;
    try {
      const response = await apiService.refreshToken({ refreshToken });
      commit('authSuccess', response.data);
      return response;
    } catch ({ response }) {
      commit('removeTokens');
      throw response;
    }
  },
  async userLoad() {
    try {
      const response = await apiService.getUser();
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  logout({ commit }) {
    try {
      commit('removeTokens');
    } catch (err) {
      throw new Error(err);
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
