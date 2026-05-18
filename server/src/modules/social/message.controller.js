import { z } from 'zod';
import * as messageService from './message.service.js';

const sendMessageSchema = z.object({
  receiverId: z.string().uuid('Invalid receiver ID').optional(),
  groupId: z.string().uuid('Invalid group ID').optional(),
  content: z.string().min(1, 'Content is required').max(2000, 'Message too long'),
  msgType: z.enum(['text', 'emoji', 'image', 'mood', 'meme', 'music']).optional().default('text'),
}).refine((data) => data.receiverId || data.groupId, {
  message: 'receiverId veya groupId gerekli',
});

export { sendMessageSchema };

export const sendMessage = async (req, res) => {
  const message = await messageService.sendMessage(req.user.userId, req.validatedBody);
  res.status(201).json({ success: true, data: message });
};

export const getConversation = async (req, res) => {
  const { friendId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const result = await messageService.getConversation(req.user.userId, friendId, page, limit);
  res.json({ success: true, data: result });
};

export const getGroupConversation = async (req, res) => {
  const { groupId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;

  const result = await messageService.getGroupConversation(req.user.userId, groupId, page, limit);
  res.json({ success: true, data: result });
};
