export const emotionalCompatibility = (userALogs, userBLogs) => {
  if (userALogs.length === 0 || userBLogs.length === 0) {
    return {
      score: 0,
      sharedEmotions: [],
      insight: 'Not enough data to calculate compatibility',
    };
  }

  const avgValenceA = userALogs.reduce((sum, l) => sum + l.valence, 0) / userALogs.length;
  const avgValenceB = userBLogs.reduce((sum, l) => sum + l.valence, 0) / userBLogs.length;
  const avgArousalA = userALogs.reduce((sum, l) => sum + l.arousal, 0) / userALogs.length;
  const avgArousalB = userBLogs.reduce((sum, l) => sum + l.arousal, 0) / userBLogs.length;

  const valenceDiff = Math.abs(avgValenceA - avgValenceB);
  const arousalDiff = Math.abs(avgArousalA - avgArousalB);

  // Max possible diff is 1.7 (valence range -0.8 to 0.9) + 0.8 (arousal range 0.1 to 0.9)
  const maxDiff = 2.5;
  const totalDiff = valenceDiff + arousalDiff;
  const score = Math.round((1 - totalDiff / maxDiff) * 100);

  const emotionsA = new Set(userALogs.map((l) => l.emotion));
  const emotionsB = new Set(userBLogs.map((l) => l.emotion));
  const sharedEmotions = [...emotionsA].filter((e) => emotionsB.has(e));

  let insight;
  if (score >= 80) {
    insight = 'You two are emotionally in sync! Your mood patterns are remarkably similar.';
  } else if (score >= 60) {
    insight = 'You share a good emotional connection with some natural differences.';
  } else if (score >= 40) {
    insight = 'Your emotional styles complement each other — different but balanced.';
  } else {
    insight = 'You experience emotions quite differently, which can bring unique perspectives.';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    sharedEmotions,
    insight,
  };
};
