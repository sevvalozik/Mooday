import api from './api.js';

export const sendMessage = async ({ receiverId, groupId, content, msgType }) => {
  const { data } = await api.post('/messages', { receiverId, groupId, content, msgType });
  return data.data;
};

export const getConversation = async (friendId, page = 1, limit = 50) => {
  const { data } = await api.get(`/messages/${friendId}`, { params: { page, limit } });
  return data.data;
};

export const getGroupConversation = async (groupId, page = 1, limit = 50) => {
  const { data } = await api.get(`/messages/group/${groupId}`, { params: { page, limit } });
  return data.data;
};
