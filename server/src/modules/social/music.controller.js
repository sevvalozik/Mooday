import { z } from 'zod';
import * as musicService from './music.service.js';

const shareSongSchema = z.object({
  receiverId: z.string().uuid('Invalid receiver ID'),
  songTitle: z.string().min(1, 'Song title is required').max(200),
  artistName: z.string().max(200).optional(),
  songUrl: z.string().url('Invalid song URL'),
  platform: z.enum(['spotify', 'youtube', 'apple', 'other']).optional().default('other'),
  note: z.string().max(500).optional(),
});

export { shareSongSchema };

export const shareSong = async (req, res) => {
  const song = await musicService.shareSong(req.user.userId, req.validatedBody);
  res.status(201).json({ success: true, data: song });
};

export const getReceivedSongs = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const songs = await musicService.getReceivedSongs(req.user.userId, limit);
  res.json({ success: true, data: songs });
};
