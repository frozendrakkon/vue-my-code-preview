import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import inspection from './modules/inspection';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    inspection,
  },
});
