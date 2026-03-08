import { useState } from 'react';
import { motion } from 'framer-motion';
import { AVATAR_OPTIONS, getAvatar } from '../../utils/avatars.js';

export const AvatarPicker = ({ selected, onSelect, compact = false }) => {
  const [hovering, setHovering] = useState(null);
  const selectedAvatar = selected ? getAvatar(selected) : null;

  return (
    <div>
      {/* Current Selection Preview */}
      {!compact && selectedAvatar && (
        <div className="mb-4 flex items-center justify-center">
          <motion.div
            key={selected}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${selectedAvatar.bg} text-4xl shadow-lg`}
          >
            {selectedAvatar.emoji}
          </motion.div>
        </div>
      )}

      {/* Grid */}
      <div className={`grid gap-2 ${compact ? 'grid-cols-6' : 'grid-cols-6 sm:grid-cols-8'}`}>
        {AVATAR_OPTIONS.map((avatar) => {
          const isSelected = selected === avatar.key;
          return (
            <motion.button
              key={avatar.key}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(avatar.key)}
              onMouseEnter={() => setHovering(avatar.key)}
              onMouseLeave={() => setHovering(null)}
              className={`relative flex aspect-square items-center justify-center rounded-xl text-xl transition-all sm:text-2xl ${
                isSelected
                  ? `bg-gradient-to-br ${avatar.bg} ring-2 ring-white/50 ring-offset-2 ring-offset-gray-900`
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              title={avatar.label}
            >
              {avatar.emoji}
              {isSelected && (
                <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[8px] text-white">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Label */}
      {hovering && (
        <p className="mt-2 text-center text-xs text-gray-400">
          {getAvatar(hovering)?.label}
        </p>
      )}
    </div>
  );
};
