import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export const shareSong = async (senderId, { receiverId, songTitle, artistName, songUrl, platform, note }) => {
  if (senderId === receiverId) {
    throw new AppError('Cannot share a song with yourself', 400, 'SELF_SHARE');
  }

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) {
    throw new AppError('Receiver not found', 404, 'USER_NOT_FOUND');
  }

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { displayName: true },
  });

  const musicShare = await prisma.musicShare.create({
    data: {
      senderId,
      receiverId,
      songTitle,
      artistName: artistName || null,
      songUrl,
      platform: platform || 'other',
      note: note || null,
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
      type: 'music_share',
      title: 'Yeni Müzik Paylaşımı',
      body: `${sender.displayName} sana "${songTitle}" şarkısını paylaştı`,
      data: { musicShareId: musicShare.id, senderId },
    },
  });

  return musicShare;
};

export const getReceivedSongs = async (userId, limit = 20) => {
  const songs = await prisma.musicShare.findMany({
    where: { receiverId: userId },
    include: {
      sender: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return songs;
};
