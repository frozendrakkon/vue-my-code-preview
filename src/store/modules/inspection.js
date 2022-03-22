import apiService from '@/services/api-service.js';

const state = {
  inspectionStep: null,
  damageStep: null,
};

const mutations = {
  setInspectionStep(state, inspectionData) {
    state.inspectionStep = inspectionData;
  },
  setDamageStep(state, damageStep) {
    state.damageStep = damageStep;
  },
};

const actions = {
  setInspectionStep({ commit }, inspectionData) {
    commit('setInspectionStep', inspectionData);
  },

  setDamageStep({ commit }, damageStep) {
    commit('setDamageStep', damageStep);
  },

  async createFile() {
    try {
      const response = await apiService.createFile({ count: 1 });
      return Promise.resolve(response);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async submitFile(ctx, formData) {
    try {
      await apiService.submitFile(formData);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
