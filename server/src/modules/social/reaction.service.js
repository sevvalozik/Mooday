import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const VALID_TYPES = ['hug', 'cheer', 'high-five', 'heart', 'laugh'];

export const sendReaction = async (senderId, { receiverId, moodLogId, type, emoji }) => {
  if (!VALID_TYPES.includes(type)) {
    throw new AppError(
      `Invalid reaction type. Must be one of: ${VALID_TYPES.join(', ')}`,
      400,
      'INVALID_TYPE'
    );
  }

  if (senderId === receiverId) {
    throw new AppError('Cannot react to yourself', 400, 'SELF_REACTION');
  }

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) {
    throw new AppError('Receiver not found', 404, 'USER_NOT_FOUND');
  }

  if (moodLogId) {
    const moodLog = await prisma.moodLog.findUnique({ where: { id: moodLogId } });
    if (!moodLog) {
      throw new AppError('Mood log not found', 404, 'MOOD_LOG_NOT_FOUND');
    }
  }

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { displayName: true },
  });

  const reaction = await prisma.reaction.create({
    data: {
      senderId,
      receiverId,
      moodLogId: moodLogId || null,
      type,
      emoji: emoji || null,
    },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: 'reaction',
      title: 'New Reaction',
      body: `${sender.displayName} sent you a ${type}`,
      data: { reactionId: reaction.id, senderId, type },
    },
  });

  return reaction;
};

export const getReceivedReactions = async (userId, limit = 20) => {
  const reactions = await prisma.reaction.findMany({
    where: { receiverId: userId },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      moodLog: {
        select: { id: true, emotion: true, colorHex: true, createdAt: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return reactions;
};
