import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOOD_MEMES } from '../../utils/memes.js';

const MOOD_FILTERS = ['all', 'happiness', 'sadness', 'anger', 'excitement', 'calm', 'anxiety', 'tired', 'hopeful'];

export const MemePicker = ({ onSelect, onClose }) => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? MOOD_MEMES
    : MOOD_MEMES.filter((m) => m.mood === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-full left-0 right-0 mb-2 max-h-80 overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <p className="text-sm font-semibold text-white">Ruh Hali Memeleri</p>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Mood filter tabs */}
      <div className="flex gap-1 overflow-x-auto px-3 py-2 scrollbar-hide">
        {MOOD_FILTERS.map((mood) => (
          <button
            key={mood}
            onClick={() => setFilter(mood)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
              filter === mood ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {mood === 'all' ? 'Hepsi' : mood.charAt(0).toUpperCase() + mood.slice(1)}
          </button>
        ))}
      </div>

      {/* Meme grid */}
      <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto p-3">
        {filtered.map((meme) => (
          <button
            key={meme.id}
            onClick={() => onSelect(meme)}
            className={`flex flex-col items-center justify-center rounded-lg bg-gradient-to-br ${meme.bg} p-3 transition-transform hover:scale-105 active:scale-95`}
          >
            <span className="text-3xl">{meme.emoji}</span>
            <span className="mt-1 text-xs font-medium text-white/90">{meme.text}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
