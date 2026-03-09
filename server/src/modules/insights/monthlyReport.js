import prisma from '../../config/database.js';

const EMOTIONS = {
  happiness:  { color: '#FFD700', label: 'Happy' },
  sadness:    { color: '#4169E1', label: 'Sad' },
  anger:      { color: '#DC143C', label: 'Angry' },
  calm:       { color: '#2E8B57', label: 'Calm' },
  excitement: { color: '#FF8C00', label: 'Excited' },
  anxiety:    { color: '#8B008B', label: 'Anxious' },
  tired:      { color: '#708090', label: 'Tired' },
  hopeful:    { color: '#FF69B4', label: 'Hopeful' },
};

export const generateMonthlyReport = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const moodLogs = await prisma.moodLog.findMany({
    where: {
      userId,
      createdAt: { gte: startDate, lt: endDate },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (moodLogs.length === 0) {
    return {
      totalLogs: 0,
      emotionDistribution: [],
      happiestDay: null,
      saddestDay: null,
      weeklyAverages: [],
      averageIntensity: 0,
      month,
      year,
    };
  }

  // Emotion distribution
  const emotionCounts = {};
  for (const log of moodLogs) {
    emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
  }
  const emotionDistribution = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({
      emotion,
      label: EMOTIONS[emotion]?.label || emotion,
      count,
      percentage: Math.round((count / moodLogs.length) * 100),
      color: EMOTIONS[emotion]?.color || '#888888',
    }))
    .sort((a, b) => b.count - a.count);

  // Happiest and saddest days
  let happiestLog = moodLogs[0];
  let saddestLog = moodLogs[0];
  for (const log of moodLogs) {
    if (log.valence > happiestLog.valence) happiestLog = log;
    if (log.valence < saddestLog.valence) saddestLog = log;
  }

  const happiestDay = {
    date: happiestLog.createdAt,
    emotion: happiestLog.emotion,
    valence: happiestLog.valence,
  };

  const saddestDay = {
    date: saddestLog.createdAt,
    emotion: saddestLog.emotion,
    valence: saddestLog.valence,
  };

  // Weekly averages
  const weeks = {};
  for (const log of moodLogs) {
    const date = new Date(log.createdAt);
    const dayOfMonth = date.getDate();
    const weekNum = Math.ceil(dayOfMonth / 7);
    if (!weeks[weekNum]) weeks[weekNum] = [];
    weeks[weekNum].push(log);
  }

  const weeklyAverages = Object.entries(weeks).map(([week, logs]) => ({
    week: parseInt(week, 10),
    avgValence: Math.round((logs.reduce((sum, l) => sum + l.valence, 0) / logs.length) * 100) / 100,
    avgIntensity: Math.round((logs.reduce((sum, l) => sum + l.intensity, 0) / logs.length) * 10) / 10,
    count: logs.length,
  }));

  // Average intensity
  const averageIntensity =
    Math.round((moodLogs.reduce((sum, l) => sum + l.intensity, 0) / moodLogs.length) * 10) / 10;

  // Daily moods — one entry per day with dominant emotion
  const dailyMap = {};
  for (const log of moodLogs) {
    const day = new Date(log.createdAt).getDate();
    if (!dailyMap[day]) dailyMap[day] = [];
    dailyMap[day].push(log);
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyMoods = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const logs = dailyMap[d];
    if (logs) {
      // Find most frequent emotion for the day
      const freq = {};
      for (const l of logs) freq[l.emotion] = (freq[l.emotion] || 0) + 1;
      const dominant = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
      const avgInt = Math.round(logs.reduce((s, l) => s + l.intensity, 0) / logs.length);
      dailyMoods.push({ day: d, dominantEmotion: dominant, intensity: avgInt, logCount: logs.length });
    } else {
      dailyMoods.push({ day: d, dominantEmotion: null, intensity: 0, logCount: 0 });
    }
  }

  // Streak
  const streak = await prisma.streak.findUnique({ where: { userId } });

  return {
    totalLogs: moodLogs.length,
    emotionDistribution,
    happiestDay,
    saddestDay,
    weeklyAverages,
    averageIntensity,
    dailyMoods: dailyMoods.filter((d) => d.dominantEmotion),
    currentStreak: streak?.currentCount || 0,
    longestStreak: streak?.longestCount || 0,
    month,
    year,
  };
};
