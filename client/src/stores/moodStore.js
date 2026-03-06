import { create } from 'zustand';

export const useMoodStore = create((set) => ({
  currentMood: null,
  moodHistory: [],
  streak: null,

  setCurrentMood: (mood) => set({ currentMood: mood }),

  setMoodHistory: (history) => set({ moodHistory: history }),

  addMoodLog: (moodLog) =>
    set((state) => ({
      currentMood: moodLog,
      moodHistory: [moodLog, ...state.moodHistory],
    })),

  setStreak: (streak) => set({ streak }),
}));
