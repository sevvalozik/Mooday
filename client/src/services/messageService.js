import api from './api.js';

export const sendMessage = async ({ receiverId, content, msgType }) => {
  const { data } = await api.post('/messages', { receiverId, content, msgType });
  return data.data;
};

export const getConversation = async (friendId, page = 1, limit = 50) => {
  const { data } = await api.get(`/messages/${friendId}`, { params: { page, limit } });
  return data.data;
};
