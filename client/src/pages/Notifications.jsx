import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { useNotificationStore } from '../stores/notificationStore.js';
import api from '../services/api.js';

const ICONS = {
  friend_request: '👋',
  friend_accepted: '🤝',
  reaction: '❤️',
  mood_update: '🔮',
  group_invite: '👥',
  music_share: '🎵',
  message: '💬',
};

export const Notifications = () => {
  const { notifications, setNotifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    const load = async () => {
      try {
        // We'd need a notification endpoint — for now, use what's in the store
        // If you add GET /api/notifications endpoint later, fetch here
      } catch {
        // silent
      }
    };
    load();
  }, []);

  const handleClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <PageWrapper>
      <h1 className="mb-6 text-2xl font-bold text-white">Notifications</h1>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 && (
          <p className="py-10 text-center text-gray-500">No notifications yet</p>
        )}

        {notifications.map((n, i) => (
          <motion.div
            key={n.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleClick(n)}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
              n.read
                ? 'border-white/5 bg-white/[0.02]'
                : 'border-purple-500/20 bg-purple-500/5'
            }`}
          >
            <span className="mt-0.5 text-xl">{ICONS[n.type] || '🔔'}</span>
            <div className="flex-1">
              <p className={`text-sm font-medium ${n.read ? 'text-gray-400' : 'text-white'}`}>
                {n.title}
              </p>
              <p className="text-sm text-gray-500">{n.body}</p>
              <p className="mt-1 text-xs text-gray-600">
                {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                }) : ''}
              </p>
            </div>
            {!n.read && <div className="mt-2 h-2 w-2 rounded-full bg-purple-500" />}
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
};
