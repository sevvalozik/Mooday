import { create } from 'zustand';

export const useSocketStore = create((set) => ({
  socket: null,
  isConnected: false,

  setSocket: (socket) => set({ socket }),
  setConnected: (isConnected) => set({ isConnected }),

  disconnect: () =>
    set((state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      return { socket: null, isConnected: false };
    }),
}));
