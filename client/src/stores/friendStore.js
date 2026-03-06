import { create } from 'zustand';

export const useFriendStore = create((set) => ({
  friends: [],
  pendingRequests: [],

  setFriends: (friends) => set({ friends }),

  setPendingRequests: (requests) => set({ pendingRequests: requests }),

  updateFriendMood: (userId, moodData) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id === userId ? { ...f, latestMood: moodData } : f
      ),
    })),
}));
