import { motion } from 'framer-motion';
import { EMOTION_LIST } from '../../utils/emotionConfig.js';

export const EmotionPicker = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {EMOTION_LIST.map((emotion) => (
        <motion.button
          key={emotion.key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(emotion.key)}
          className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 sm:gap-2 sm:p-4 transition-all ${
            selected === emotion.key
              ? 'border-current shadow-lg shadow-current/20'
              : 'border-white/10 hover:border-white/20'
          }`}
          style={{
            color: emotion.color,
            backgroundColor: selected === emotion.key ? `${emotion.color}15` : 'transparent',
          }}
        >
          <span className="text-2xl">{emotion.icon}</span>
          <span className="text-xs font-medium">{emotion.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
