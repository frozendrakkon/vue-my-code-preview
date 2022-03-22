import axios from 'axios';

export default {
  login(userLoginPassword) {
    return axios.post('/api/v1/tokens', userLoginPassword);
  },
  refreshToken(rt) {
    return axios.put('/api/v1/tokens', rt);
  },
  getUser() {
    return axios.get('/api/v1/admin/user');
  },
  loadContracts() {
    return axios.get('/api/v1/contracts');
  },
  loadInspectionParams() {
    return axios.get('/api/v1/inspection/parameters');
  },
  loadDamagesList() {
    return axios.get('/api/v1/inspection/script');
  },
  createFile(payload) {
    return axios.post('/api/v1/files/create', payload);
  },
  submitFile(payload) {
    return axios.put('/api/v1/files', payload);
  },
};
