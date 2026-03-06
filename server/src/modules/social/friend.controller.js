import * as friendService from './friend.service.js';

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
