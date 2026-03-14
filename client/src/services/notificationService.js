import api from './api.js';

export const getNotifications = async (page = 1, limit = 30) => {
  const { data } = await api.get('/notifications', { params: { page, limit } });
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.patch('/notifications/read-all');
  return data;
};
