import api from './api.js';

export const sendReaction = async ({ receiverId, moodLogId, type, emoji }) => {
  const { data } = await api.post('/reactions', { receiverId, moodLogId, type, emoji });
  return data.data;
};

export const getReceivedReactions = async (limit = 20) => {
  const { data } = await api.get('/reactions/received', { params: { limit } });
  return data.data;
};
