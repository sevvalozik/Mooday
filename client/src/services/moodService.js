import api from './api.js';

export const logMood = async ({ emotion, intensity, journal }) => {
  const { data } = await api.post('/moods', { emotion, intensity, journal });
  return data.data;
};

export const getCurrentMood = async () => {
  const { data } = await api.get('/moods/current');
  return data.data;
};

export const getHistory = async (page = 1, limit = 20) => {
  const { data } = await api.get('/moods/history', { params: { page, limit } });
  return data;
};

export const getStreak = async () => {
  const { data } = await api.get('/moods/streak');
  return data.data;
};
