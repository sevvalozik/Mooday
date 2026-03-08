import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { FriendGalaxy } from '../components/sphere/FriendGalaxy.jsx';
import { StreakBadge } from '../components/ui/StreakBadge.jsx';
import { DashboardSkeleton } from '../components/ui/Skeleton.jsx';
import { UserAvatar } from '../components/ui/UserAvatar.jsx';
import { useMoodStore } from '../stores/moodStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { useAuthStore } from '../stores/authStore.js';
import * as moodService from '../services/moodService.js';
import * as friendService from '../services/friendService.js';
import * as insightService from '../services/insightService.js';
import * as reactionService from '../services/reactionService.js';

const REACTION_EMOJI = {
  hug: '🤗',
  cheer: '🎉',
  'high-five': '🙌',
  heart: '❤️',
  laugh: '😂',
};

export const Dashboard = () => {
  const { currentMood, streak, setCurrentMood, setStreak } = useMoodStore();
  const { friends, setFriends } = useFriendStore();
  const user = useAuthStore((s) => s.user);
  const [insights, setInsights] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mood, streakData, friendsData, insightsData, reactionsData] = await Promise.all([
          moodService.getCurrentMood(),
          moodService.getStreak(),
          friendService.getFriends(),
          insightService.getWeeklyInsights().catch(() => null),
          reactionService.getReceivedReactions(10).catch(() => []),
        ]);
        setCurrentMood(mood);
        setStreak(streakData);
        setFriends(friendsData);
        setInsights(insightsData);
        setReactions(reactionsData || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <DashboardSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hey, {user?.displayName || 'there'} 👋
            </h1>
            <p className="text-gray-400">
              {insights?.weatherReport || 'Check in with your mood today'}
            </p>
          </div>
          <Link
            to="/mood/new"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-2xl text-white shadow-lg shadow-purple-600/30 transition-transform hover:scale-110"
          >
            +
          </Link>
        </div>

        {/* Streak */}
        {streak && <StreakBadge count={streak.currentCount} longest={streak.longestCount} />}

        {/* Current Mood Journal */}
        {currentMood?.journal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-4"
          >
            <p className="mb-1 text-xs font-medium text-gray-500">Today's Journal</p>
            <p className="text-sm text-gray-300 italic">"{currentMood.journal}"</p>
          </motion.div>
        )}

        {/* Galaxy View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Your Galaxy</h2>
          <FriendGalaxy friends={friends} userMood={currentMood} />
        </motion.div>

        {/* Received Reactions */}
        {reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
            <h2 className="mb-3 text-lg font-semibold text-white">Reactions from Friends</h2>
            <div className="flex flex-col gap-2">
              {reactions.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                >
                  <UserAvatar user={r.sender} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{r.sender?.displayName}</span>
                      {' '}sent you a {r.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-2xl">{REACTION_EMOJI[r.type] || r.emoji || '💜'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weekly Insights Card */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <h2 className="mb-3 text-lg font-semibold text-white">Weekly Insights</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-sm text-gray-400">Trend</p>
                <p className="text-lg font-bold text-white">
                  {insights.trend?.direction === 'up' ? '📈 Upward' :
                   insights.trend?.direction === 'down' ? '📉 Downward' : '➡️ Stable'}
                </p>
                <p className="text-xs text-gray-500">{insights.trend?.percentage}% change</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-sm text-gray-400">Logs This Week</p>
                <p className="text-lg font-bold text-white">{insights.totalLogs}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <p className="text-sm text-gray-400">Best Day</p>
                <p className="text-lg font-bold text-white">
                  {insights.dayPatterns?.filter((d) => d.avgValence !== null)
                    .sort((a, b) => b.avgValence - a.avgValence)[0]?.day || 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};
