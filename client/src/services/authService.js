import api from './api.js';

export const register = async ({ email, username, displayName, password }) => {
  const { data } = await api.post('/auth/register', { email, username, displayName, password });
  return data.data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};

export const refreshToken = async (token) => {
  const { data } = await api.post('/auth/refresh', { refreshToken: token });
  return data.data;
};
