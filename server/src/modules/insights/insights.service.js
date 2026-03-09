import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { detectDayPatterns, detectTimePatterns, detectTrend } from './patterns.js';
import { emotionalCompatibility } from './compatibility.js';
import { generateMonthlyReport } from './monthlyReport.js';

const DAY_TR = {
  Monday: 'Pazartesi',
  Tuesday: 'Salı',
  Wednesday: 'Çarşamba',
  Thursday: 'Perşembe',
  Friday: 'Cuma',
  Saturday: 'Cumartesi',
  Sunday: 'Pazar',
};

const generateWeatherReport = (trend, dayPatterns) => {
  const trendText =
    trend.direction === 'up'
      ? `yükselişte (+${trend.percentage}%) 🌤️`
      : trend.direction === 'down'
        ? `düşüşte (-${trend.percentage}%) 🌧️`
        : 'dengeli ☁️';

  const bestDay = dayPatterns
    .filter((d) => d.avgValence !== null)
    .sort((a, b) => b.avgValence - a.avgValence)[0];

  const bestDayText = bestDay ? `En iyi günün genelde ${DAY_TR[bestDay.day] || bestDay.day}.` : '';

  return `Bu haftaki ruh halin ${trendText} ${bestDayText}`;
};

export const getWeeklyInsights = async (userId) => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const moodLogs = await prisma.moodLog.findMany({
    where: {
      userId,
      createdAt: { gte: fourteenDaysAgo },
    },
    orderBy: { createdAt: 'asc' },
  });

  const dayPatterns = detectDayPatterns(moodLogs);
  const timePatterns = detectTimePatterns(moodLogs);
  const trend = detectTrend(moodLogs);
  const weatherReport = generateWeatherReport(trend, dayPatterns);

  return {
    dayPatterns,
    timePatterns,
    trend,
    weatherReport,
    totalLogs: moodLogs.length,
  };
};

export const getMonthlySummary = async (userId, year, month) => {
  return generateMonthlyReport(userId, year, month);
};

export const getCompatibility = async (userId, friendId) => {
  // Verify friendship exists
  const [userAId, userBId] = userId < friendId ? [userId, friendId] : [friendId, userId];
  const friendship = await prisma.friendship.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });

  if (!friendship || friendship.status !== 'accepted') {
    throw new AppError('You are not friends with this user', 403, 'NOT_FRIENDS');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [userLogs, friendLogs] = await Promise.all([
    prisma.moodLog.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.moodLog.findMany({
      where: { userId: friendId, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const friend = await prisma.user.findUnique({
    where: { id: friendId },
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  });

  const compatibility = emotionalCompatibility(userLogs, friendLogs);

  return {
    friend,
    ...compatibility,
  };
};
