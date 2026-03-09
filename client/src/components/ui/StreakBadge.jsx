import { motion } from 'framer-motion';

const MILESTONES = [
  { min: 100, label: 'Efsane', color: 'bg-amber-400/20 text-amber-300' },
  { min: 60, label: 'Elmas', color: 'bg-cyan-400/20 text-cyan-300' },
  { min: 30, label: 'Altın', color: 'bg-yellow-400/20 text-yellow-300' },
  { min: 14, label: 'Gümüş', color: 'bg-slate-300/20 text-slate-300' },
  { min: 7, label: 'Bronz', color: 'bg-orange-400/20 text-orange-300' },
];

export const StreakBadge = ({ count = 0, longest = 0 }) => {
  const milestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone = milestones.find((m) => m > count) || count + 10;
  const earned = MILESTONES.filter((m) => count >= m.min);

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 text-lg font-bold text-orange-400">
          {count}
        </div>
        <div>
          <p className="text-sm font-bold text-orange-400">günlük seri</p>
          <p className="text-xs text-gray-400">En iyi: {longest}d / Sonraki: {nextMilestone}d</p>
        </div>
      </div>
      {earned.length > 0 && (
        <div className="ml-auto flex gap-1.5">
          {earned.map((m) => (
            <span
              key={m.label}
              title={`${m.min}-day streak`}
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${m.color}`}
            >
              {m.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
