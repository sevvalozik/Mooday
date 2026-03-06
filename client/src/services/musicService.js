import api from './api.js';

export const shareSong = async ({ receiverId, songTitle, artistName, songUrl, platform, note }) => {
  const { data } = await api.post('/music', { receiverId, songTitle, artistName, songUrl, platform, note });
  return data.data;
};

export const getReceivedSongs = async (limit = 20) => {
  const { data } = await api.get('/music/received', { params: { limit } });
  return data.data;
};
