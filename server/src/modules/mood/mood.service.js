import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

let getIO;
try {
  const socketModule = await import('../../config/socket.js');
  getIO = socketModule.getIO;
} catch {
  getIO = null;
}

const EMOTIONS = {
  happiness:  { color: '#FFD700', valence:  0.8, arousal: 0.5 },
  sadness:    { color: '#4169E1', valence: -0.7, arousal: 0.2 },
  anger:      { color: '#DC143C', valence: -0.8, arousal: 0.9 },
  calm:       { color: '#2E8B57', valence:  0.5, arousal: 0.1 },
  excitement: { color: '#FF8C00', valence:  0.9, arousal: 0.9 },
  anxiety:    { color: '#8B008B', valence: -0.5, arousal: 0.8 },
  tired:      { color: '#708090', valence: -0.2, arousal: 0.1 },
  hopeful:    { color: '#FF69B4', valence:  0.6, arousal: 0.4 },
};

const getDateOnly = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const isYesterday = (date) => {
  const today = getDateOnly(new Date());
  const target = getDateOnly(date);
  const diff = today.getTime() - target.getTime();
  return diff === 24 * 60 * 60 * 1000;
};

const isToday = (date) => {
  const today = getDateOnly(new Date());
  const target = getDateOnly(date);
  return today.getTime() === target.getTime();
};

export const createMood = async (userId, { emotion, intensity, journal }) => {
  const emotionConfig = EMOTIONS[emotion];
  if (!emotionConfig) {
    throw new AppError('Invalid emotion', 400, 'INVALID_EMOTION');
  }

  const moodLog = await prisma.moodLog.create({
    data: {
      userId,
      emotion,
      valence: emotionConfig.valence,
      arousal: emotionConfig.arousal,
      intensity,
      colorHex: emotionConfig.color,
      journal: journal || null,
    },
  });

  // Update streak
  const existingStreak = await prisma.streak.findUnique({
    where: { userId },
  });

  if (!existingStreak) {
    await prisma.streak.create({
      data: {
        userId,
        currentCount: 1,
        longestCount: 1,
        lastLogDate: new Date(),
      },
    });
  } else if (existingStreak.lastLogDate && isToday(existingStreak.lastLogDate)) {
    // Already logged today, do nothing to the streak
  } else if (!existingStreak.lastLogDate || isYesterday(existingStreak.lastLogDate)) {
    const newCount = existingStreak.currentCount + 1;
    await prisma.streak.update({
      where: { userId },
      data: {
        currentCount: newCount,
        longestCount: newCount > existingStreak.longestCount ? newCount : existingStreak.longestCount,
        lastLogDate: new Date(),
      },
    });
  } else {
    // Streak broken, reset to 1
    await prisma.streak.update({
      where: { userId },
      data: {
        currentCount: 1,
        longestCount: existingStreak.longestCount,
        lastLogDate: new Date(),
      },
    });
  }

  // Try to emit socket event
  try {
    if (getIO) {
      const io = getIO();
      io.to(userId).emit('mood:update', moodLog);
    }
  } catch {
    // Socket not available, silently ignore
  }

  return moodLog;
};

export const getCurrentMood = async (userId) => {
  const moodLog = await prisma.moodLog.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return moodLog;
};

export const getHistory = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [moodLogs, total] = await Promise.all([
    prisma.moodLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.moodLog.count({ where: { userId } }),
  ]);

  return {
    data: moodLogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStreak = async (userId) => {
  const streak = await prisma.streak.findUnique({
    where: { userId },
  });

  if (!streak) {
    return { currentCount: 0, longestCount: 0, lastLogDate: null };
  }

  return streak;
};
