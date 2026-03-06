import { motion } from 'framer-motion';

export const StreakBadge = ({ count = 0, longest = 0 }) => {
  const milestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone = milestones.find((m) => m > count) || count + 10;

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-lg font-bold text-orange-400">{count} day streak</p>
          <p className="text-xs text-gray-400">Best: {longest} days | Next: {nextMilestone} days</p>
        </div>
      </div>
      {count >= 7 && (
        <div className="ml-auto flex gap-1">
          {count >= 7 && <span title="7-day streak">🥉</span>}
          {count >= 14 && <span title="14-day streak">🥈</span>}
          {count >= 30 && <span title="30-day streak">🥇</span>}
          {count >= 60 && <span title="60-day streak">💎</span>}
          {count >= 100 && <span title="100-day streak">👑</span>}
        </div>
      )}
    </motion.div>
  );
};
