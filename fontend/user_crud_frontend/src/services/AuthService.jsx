import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

export const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('role', res.data.role);
  
  axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  return res.data;
};

export const register = async (user) => {
  return axios.post(`${API_URL}/register`, user);
};

export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};
