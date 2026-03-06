import api from './api.js';

export const createGroup = async ({ name, emoji }) => {
  const { data } = await api.post('/groups', { name, emoji });
  return data.data;
};

export const getGroups = async () => {
  const { data } = await api.get('/groups');
  return data.data;
};

export const getGroup = async (groupId) => {
  const { data } = await api.get(`/groups/${groupId}`);
  return data.data;
};

export const addMember = async (groupId, userId) => {
  const { data } = await api.post(`/groups/${groupId}/members`, { userId });
  return data.data;
};

export const removeMember = async (groupId, userId) => {
  const { data } = await api.delete(`/groups/${groupId}/members/${userId}`);
  return data.data;
};
