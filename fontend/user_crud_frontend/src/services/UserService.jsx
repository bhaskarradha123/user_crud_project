import axios from 'axios';

const api = axios.create({
  baseURL: 'https://user-crud-backend-53a3.onrender.com',
});

// Add JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// User endpoints(can use by user and admin both)
export const getCurrentUserProfile = () => api.get('/user/profile');
export const updateCurrentUserProfile = (user) => api.put('/user/update', user);
export const deleteCurrentUserProfile = () => api.delete('/user/delete');

// Admin endpoints
export const getAllUsers = () => api.get('/admin/fetchAllUsers');
export const deleteUserById = (id) => api.delete(`/admin/delete/${id}`);
export const updateUserById = (id, user) => api.put(`/admin/update/${id}`, user);
