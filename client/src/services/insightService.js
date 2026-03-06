import api from './api.js';

export const getWeeklyInsights = async () => {
  const { data } = await api.get('/insights/weekly');
  return data.data;
};

export const getMonthlySummary = async (year, month) => {
  const { data } = await api.get('/insights/monthly', { params: { year, month } });
  return data.data;
};

export const getCompatibility = async (friendId) => {
  const { data } = await api.get(`/insights/compatibility/${friendId}`);
  return data.data;
};
