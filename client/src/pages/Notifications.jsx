import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { useNotificationStore } from '../stores/notificationStore.js';
import * as notificationService from '../services/notificationService.js';

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
  const { setNotifications, markAsRead: storeMarkAsRead } = useNotificationStore();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    try {
      const res = await notificationService.getNotifications(p, 30);
      const data = res.data || [];
      if (p === 1) {
        setItems(data);
        setNotifications(data);
      } else {
        setItems((prev) => [...prev, ...data]);
      }
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      // If endpoint not available, keep store data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const handleClick = async (notification) => {
    if (!notification.read) {
      storeMarkAsRead(notification.id);
      setItems((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
      try {
        await notificationService.markAsRead(notification.id);
      } catch {
        // silent
      }
    }
  };

  const handleMarkAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllAsRead();
    } catch {
      // silent
    }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next);
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Bildirimler</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-600/20"
          >
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <p className="text-gray-500">Henüz bildirim yok</p>
          </div>
        )}

        {items.map((n, i) => {
          const style = TYPE_STYLE[n.type] || fallbackStyle;
          return (
            <motion.div
              key={n.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
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

        {page < totalPages && (
          <button
            onClick={handleLoadMore}
            className="mt-4 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            Daha fazla yükle
          </button>
        )}
      </div>
    </PageWrapper>
  );
};
