import prisma from '../../config/database.js';
import * as friendService from './friend.service.js';

export const searchUsers = async (req, res) => {
  const query = req.query.q?.trim();
  if (!query || query.length < 2) {
    return res.json({ success: true, data: [] });
  }
  const users = await prisma.user.findMany({
    where: {
      id: { not: req.user.userId },
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, username: true, displayName: true, avatarUrl: true },
    take: 10,
  });
  res.json({ success: true, data: users });
};

export const listFriends = async (req, res) => {
  const friends = await friendService.listFriends(req.user.userId);
  res.json({ success: true, data: friends });
};

export const sendRequest = async (req, res) => {
  const friendship = await friendService.sendRequest(req.user.userId, req.params.id);
  res.status(201).json({ success: true, data: friendship });
};

export const acceptRequest = async (req, res) => {
  const friendship = await friendService.acceptRequest(req.user.userId, req.params.id);
  res.json({ success: true, data: friendship });
};

export const getPendingRequests = async (req, res) => {
  const requests = await friendService.getPendingRequests(req.user.userId);
  res.json({ success: true, data: requests });
};

export const removeFriend = async (req, res) => {
  const result = await friendService.removeFriend(req.user.userId, req.params.id);
  res.json({ success: true, data: result });
};
