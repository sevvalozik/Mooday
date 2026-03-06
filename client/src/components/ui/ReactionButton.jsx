import { motion } from 'framer-motion';

const REACTIONS = [
  { type: 'hug', emoji: '🤗', label: 'Hug' },
  { type: 'cheer', emoji: '🎉', label: 'Cheer' },
  { type: 'high-five', emoji: '🙌', label: 'High Five' },
  { type: 'heart', emoji: '❤️', label: 'Heart' },
  { type: 'laugh', emoji: '😄', label: 'Laugh' },
];

export const ReactionButton = ({ onReact, disabled = false }) => {
  return (
    <div className="flex items-center gap-2">
      {REACTIONS.map(({ type, emoji, label }) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onReact(type)}
          disabled={disabled}
          title={label}
          className="rounded-full p-2 text-xl transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
};

export { REACTIONS };
