import { create } from 'zustand';

let moodUpdateTimer = null;
const pendingMoodUpdates = new Map();

export const useFriendStore = create((set) => ({
  friends: [],
  pendingRequests: [],

  setFriends: (friends) => set({ friends }),

  setPendingRequests: (requests) => set({ pendingRequests: requests }),

  // Throttled: batch mood updates to avoid rapid re-renders
  updateFriendMood: (userId, moodData) => {
    pendingMoodUpdates.set(userId, moodData);
    if (moodUpdateTimer) return;
    moodUpdateTimer = setTimeout(() => {
      moodUpdateTimer = null;
      const updates = new Map(pendingMoodUpdates);
      pendingMoodUpdates.clear();
      set((state) => ({
        friends: state.friends.map((f) =>
          updates.has(f.id) ? { ...f, latestMood: updates.get(f.id) } : f
        ),
      }));
    }, 2000);
  },
}));
