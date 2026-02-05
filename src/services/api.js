import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction APIs
export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getById: (id) => api.get(`/transactions/${id}`),
  getAll: () => api.get('/transactions'),
  getByDateRange: (startDate, endDate) => 
    api.get('/transactions/date-range', { 
      params: { startDate, endDate } 
    }),
  getByType: (type) => api.get(`/transactions/type/${type}`),
  getByDivision: (division) => api.get(`/transactions/division/${division}`),
  getByCategory: (category) => api.get(`/transactions/category/${category}`),
  getDashboard: (startDate, endDate) => 
    api.get('/transactions/dashboard', { 
      params: { startDate, endDate } 
    }),
  getCategories: (type) => 
    api.get('/transactions/categories', { 
      params: { type } 
    }),
};

// Account APIs
export const accountAPI = {
  create: (accountName, initialBalance, accountType) => 
    api.post('/accounts', null, {
      params: { accountName, initialBalance, accountType }
    }),
  getAll: () => api.get('/accounts'),
  getByName: (accountName) => api.get(`/accounts/${accountName}`),
  delete: (id) => api.delete(`/accounts/${id}`),
};

export default api;
