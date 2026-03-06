import { z } from 'zod';
import * as groupService from './group.service.js';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(50),
  emoji: z.string().max(10).optional(),
});

const addMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export { createGroupSchema, addMemberSchema };

export const createGroup = async (req, res) => {
  const group = await groupService.createGroup(req.user.userId, req.validatedBody);
  res.status(201).json({ success: true, data: group });
};

export const getGroups = async (req, res) => {
  const groups = await groupService.getGroups(req.user.userId);
  res.json({ success: true, data: groups });
};

export const getGroup = async (req, res) => {
  const group = await groupService.getGroup(req.user.userId, req.params.id);
  res.json({ success: true, data: group });
};

export const addMember = async (req, res) => {
  const member = await groupService.addMember(
    req.user.userId,
    req.params.id,
    req.validatedBody.userId
  );
  res.status(201).json({ success: true, data: member });
};

export const removeMember = async (req, res) => {
  const result = await groupService.removeMember(
    req.user.userId,
    req.params.id,
    req.params.userId
  );
  res.json({ success: true, data: result });
};
