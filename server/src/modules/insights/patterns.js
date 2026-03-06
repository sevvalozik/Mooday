const EMOTIONS = {
  happiness:  { color: '#FFD700', valence:  0.8, arousal: 0.5, label: 'Happy' },
  sadness:    { color: '#4169E1', valence: -0.7, arousal: 0.2, label: 'Sad' },
  anger:      { color: '#DC143C', valence: -0.8, arousal: 0.9, label: 'Angry' },
  calm:       { color: '#2E8B57', valence:  0.5, arousal: 0.1, label: 'Calm' },
  excitement: { color: '#FF8C00', valence:  0.9, arousal: 0.9, label: 'Excited' },
  anxiety:    { color: '#8B008B', valence: -0.5, arousal: 0.8, label: 'Anxious' },
  tired:      { color: '#708090', valence: -0.2, arousal: 0.1, label: 'Tired' },
  hopeful:    { color: '#FF69B4', valence:  0.6, arousal: 0.4, label: 'Hopeful' },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_PERIODS = [
  { name: 'morning',   startHour: 6,  endHour: 12 },
  { name: 'afternoon', startHour: 12, endHour: 18 },
  { name: 'evening',   startHour: 18, endHour: 24 },
  { name: 'night',     startHour: 0,  endHour: 6 },
];

const getTimePeriod = (hour) => {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 24) return 'evening';
  return 'night';
};

const findDominantEmotion = (logs) => {
  const counts = {};
  for (const log of logs) {
    counts[log.emotion] = (counts[log.emotion] || 0) + 1;
  }

  let dominant = null;
  let maxCount = 0;
  for (const [emotion, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = emotion;
    }
  }
  return dominant;
};

export const detectDayPatterns = (moodLogs) => {
  const dayBuckets = Array.from({ length: 7 }, () => []);

  for (const log of moodLogs) {
    const date = new Date(log.createdAt);
    const dayIndex = date.getDay();
    dayBuckets[dayIndex].push(log);
  }

  const results = [];
  for (let i = 0; i < 7; i++) {
    const logs = dayBuckets[i];
    if (logs.length === 0) {
      results.push({
        day: DAY_NAMES[i],
        avgValence: null,
        dominantEmotion: null,
        count: 0,
      });
      continue;
    }

    const avgValence = logs.reduce((sum, l) => sum + l.valence, 0) / logs.length;
    const dominantEmotion = findDominantEmotion(logs);

    results.push({
      day: DAY_NAMES[i],
      avgValence: Math.round(avgValence * 100) / 100,
      dominantEmotion,
      count: logs.length,
    });
  }

  return results;
};

export const detectTimePatterns = (moodLogs) => {
  const periodBuckets = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };

  for (const log of moodLogs) {
    const date = new Date(log.createdAt);
    const hour = date.getHours();
    const period = getTimePeriod(hour);
    periodBuckets[period].push(log);
  }

  const results = [];
  for (const { name } of TIME_PERIODS) {
    const logs = periodBuckets[name];
    if (logs.length === 0) {
      results.push({
        period: name,
        avgValence: null,
        dominantEmotion: null,
        count: 0,
      });
      continue;
    }

    const avgValence = logs.reduce((sum, l) => sum + l.valence, 0) / logs.length;
    const dominantEmotion = findDominantEmotion(logs);

    results.push({
      period: name,
      avgValence: Math.round(avgValence * 100) / 100,
      dominantEmotion,
      count: logs.length,
    });
  }

  return results;
};

export const detectTrend = (moodLogs) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const recentLogs = moodLogs.filter((l) => new Date(l.createdAt) >= sevenDaysAgo);
  const previousLogs = moodLogs.filter(
    (l) => new Date(l.createdAt) >= fourteenDaysAgo && new Date(l.createdAt) < sevenDaysAgo
  );

  const currentAvg =
    recentLogs.length > 0
      ? recentLogs.reduce((sum, l) => sum + l.valence, 0) / recentLogs.length
      : 0;

  const previousAvg =
    previousLogs.length > 0
      ? previousLogs.reduce((sum, l) => sum + l.valence, 0) / previousLogs.length
      : 0;

  const diff = currentAvg - previousAvg;
  const STABLE_THRESHOLD = 0.05;

  let direction;
  if (Math.abs(diff) < STABLE_THRESHOLD) {
    direction = 'stable';
  } else if (diff > 0) {
    direction = 'up';
  } else {
    direction = 'down';
  }

  const percentage =
    previousAvg !== 0
      ? Math.round((Math.abs(diff) / Math.abs(previousAvg)) * 100 * 100) / 100
      : 0;

  return {
    direction,
    percentage,
    currentAvg: Math.round(currentAvg * 100) / 100,
    previousAvg: Math.round(previousAvg * 100) / 100,
  };
};

export { EMOTIONS };
