import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  addNotification: (notification) =>
    set((state) => {
      // Prevent duplicates
      if (state.notifications.some((n) => n.id === notification.id)) return state;
      // Cap at 100 to prevent memory leak
      const updated = [notification, ...state.notifications].slice(0, 100);
      return {
        notifications: updated,
        unreadCount: Math.min(state.unreadCount + 1, 99),
      };
    }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
