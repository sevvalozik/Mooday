import { z } from 'zod';
import * as reactionService from './reaction.service.js';

const sendReactionSchema = z.object({
  receiverId: z.string().uuid('Invalid receiver ID'),
  moodLogId: z.string().uuid('Invalid mood log ID').optional(),
  type: z.enum(['hug', 'cheer', 'high-five', 'heart', 'laugh'], {
    errorMap: () => ({ message: 'Type must be one of: hug, cheer, high-five, heart, laugh' }),
  }),
  emoji: z.string().max(10).optional(),
});

export { sendReactionSchema };

export const sendReaction = async (req, res) => {
  const reaction = await reactionService.sendReaction(req.user.userId, req.validatedBody);
  res.status(201).json({ success: true, data: reaction });
};

export const getReceivedReactions = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const reactions = await reactionService.getReceivedReactions(req.user.userId, limit);
  res.json({ success: true, data: reactions });
};
