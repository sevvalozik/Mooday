import api from './api.js';

export const getFriends = async () => {
  const { data } = await api.get('/friends');
  return data.data;
};

export const sendRequest = async (userId) => {
  const { data } = await api.post(`/friends/request/${userId}`);
  return data.data;
};

export const acceptRequest = async (friendshipId) => {
  const { data } = await api.post(`/friends/accept/${friendshipId}`);
  return data.data;
};

export const getPendingRequests = async () => {
  const { data } = await api.get('/friends/requests');
  return data.data;
};

export const removeFriend = async (friendshipId) => {
  const { data } = await api.delete(`/friends/${friendshipId}`);
  return data.data;
};
