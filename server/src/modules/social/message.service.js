import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

let getIO;
try {
  const socketModule = await import('../../config/socket.js');
  getIO = socketModule.getIO;
} catch {
  getIO = null;
}

export const sendMessage = async (senderId, { receiverId, content, msgType }) => {
  if (senderId === receiverId) {
    throw new AppError('Cannot send a message to yourself', 400, 'SELF_MESSAGE');
  }

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) {
    throw new AppError('Receiver not found', 404, 'USER_NOT_FOUND');
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content,
      msgType: msgType || 'text',
    },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  // Try to emit socket event for real-time delivery
  if (getIO) {
    try {
      const io = getIO();
      io.to(`user:${receiverId}`).emit('message:new', message);
    } catch {
      // Socket not initialized or emission failed — non-critical
    }
  }

  return message;
};

export const getConversation = async (userId, friendId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.message.count({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    }),
  ]);

  // Mark unread messages from the friend as read
  await prisma.message.updateMany({
    where: {
      senderId: friendId,
      receiverId: userId,
      read: false,
    },
    data: { read: true },
  });

  return {
    messages: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
