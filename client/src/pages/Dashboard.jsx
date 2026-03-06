import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { FriendGalaxy } from '../components/sphere/FriendGalaxy.jsx';
import { StreakBadge } from '../components/ui/StreakBadge.jsx';
import { DashboardSkeleton } from '../components/ui/Skeleton.jsx';
import { useMoodStore } from '../stores/moodStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { useAuthStore } from '../stores/authStore.js';
import * as moodService from '../services/moodService.js';
import * as friendService from '../services/friendService.js';
import * as insightService from '../services/insightService.js';

export const Dashboard = () => {
  const { currentMood, streak, setCurrentMood, setStreak } = useMoodStore();
  const { friends, setFriends } = useFriendStore();
  const user = useAuthStore((s) => s.user);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mood, streakData, friendsData, insightsData] = await Promise.all([
          moodService.getCurrentMood(),
          moodService.getStreak(),
          friendService.getFriends(),
          insightService.getWeeklyInsights().catch(() => null),
        ]);
        setCurrentMood(mood);
        setStreak(streakData);
        setFriends(friendsData);
        setInsights(insightsData);
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
            className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-2xl shadow-lg shadow-purple-600/30 transition-transform hover:scale-110"
          >
            +
          </Link>
        </div>

        {/* Streak */}
        {streak && <StreakBadge count={streak.currentCount} longest={streak.longestCount} />}

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
