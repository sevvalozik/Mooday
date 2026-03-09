import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { useNotificationStore } from '../stores/notificationStore.js';
import api from '../services/api.js';

const TYPE_STYLE = {
  friend_request: { bg: 'bg-blue-500/15', text: 'text-blue-400', letter: 'FR' },
  friend_accepted: { bg: 'bg-green-500/15', text: 'text-green-400', letter: 'FA' },
  reaction: { bg: 'bg-pink-500/15', text: 'text-pink-400', letter: 'R' },
  mood_update: { bg: 'bg-purple-500/15', text: 'text-purple-400', letter: 'M' },
  group_invite: { bg: 'bg-amber-500/15', text: 'text-amber-400', letter: 'G' },
  music_share: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', letter: 'S' },
  message: { bg: 'bg-violet-500/15', text: 'text-violet-400', letter: 'C' },
};

const fallbackStyle = { bg: 'bg-gray-500/15', text: 'text-gray-400', letter: 'N' };

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
      <h1 className="mb-6 text-2xl font-bold text-white">Bildirimler</h1>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <p className="text-gray-500">Henüz bildirim yok</p>
          </div>
        )}

        {notifications.map((n, i) => {
          const style = TYPE_STYLE[n.type] || fallbackStyle;
          return (
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
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${style.bg} ${style.text}`}>
                {style.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.read ? 'text-gray-400' : 'text-white'}`}>
                  {n.title}
                </p>
                <p className="text-sm text-gray-500">{n.body}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString('tr-TR', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  }) : ''}
                </p>
              </div>
              {!n.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />}
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
};
