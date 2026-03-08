import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { StreakBadge } from '../components/ui/StreakBadge.jsx';
import { ProfileSkeleton } from '../components/ui/Skeleton.jsx';
import { UserAvatar } from '../components/ui/UserAvatar.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { useMoodStore } from '../stores/moodStore.js';
import { EMOTIONS } from '../utils/emotionConfig.js';
import * as moodService from '../services/moodService.js';

export const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const sphereStyle = useAuthStore((s) => s.sphereStyle);
  const { currentMood, moodHistory, streak, setCurrentMood, setMoodHistory, setStreak } = useMoodStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [mood, historyRes, streakData] = await Promise.all([
          moodService.getCurrentMood(),
          moodService.getHistory(1, 10),
          moodService.getStreak(),
        ]);
        setCurrentMood(mood);
        setMoodHistory(historyRes.data);
        setStreak(streakData);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <ProfileSkeleton />
      </PageWrapper>
    );
  }

  const emotion = currentMood?.emotion || 'calm';
  const config = EMOTIONS[emotion] || EMOTIONS.calm;

  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-6">
        {/* User Info */}
        <div className="text-center">
          <UserAvatar user={user} size="xl" className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">{user?.displayName}</h1>
          <p className="text-gray-400">@{user?.username}</p>
          {user?.bio && <p className="mt-1 text-sm text-gray-500">{user.bio}</p>}
        </div>

        {/* Sphere */}
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <MoodSphere emotion={emotion} intensity={currentMood?.intensity || 5} size="large" style={sphereStyle} />
        </motion.div>

        {/* Current Mood */}
        {currentMood && (
          <div className="text-center">
            <p className="text-lg">
              <span className="mr-2 text-2xl">{config.icon}</span>
              Currently feeling <span className="font-bold" style={{ color: config.color }}>{config.label}</span>
            </p>
            <p className="text-sm text-gray-400">Intensity: {currentMood.intensity}/10</p>
          </div>
        )}

        {/* Streak */}
        {streak && <StreakBadge count={streak.currentCount} longest={streak.longestCount} />}

        {/* Mood History */}
        <div className="w-full max-w-md">
          <h2 className="mb-3 text-lg font-semibold text-white">Recent Moods</h2>
          <div className="flex flex-col gap-2">
            {moodHistory.map((log) => {
              const logConfig = EMOTIONS[log.emotion] || EMOTIONS.calm;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-xl">{logConfig.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: logConfig.color }}>
                      {logConfig.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{log.intensity}/10</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
