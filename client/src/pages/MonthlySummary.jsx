import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';
import * as insightService from '../services/insightService.js';

const SLIDES = ['overview', 'distribution', 'timeline', 'highlights', 'streak'];

export const MonthlySummary = () => {
  const [data, setData] = useState(null);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    insightService
      .getMonthlySummary(now.getFullYear(), now.getMonth() + 1)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20 text-gray-400">Loading summary...</div>
      </PageWrapper>
    );
  }

  if (!data || data.totalLogs === 0) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-gray-400">No mood data for this month yet.</div>
      </PageWrapper>
    );
  }

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Monthly Wrapped</h1>

        <div className="relative min-h-[400px] rounded-2xl border border-white/10 bg-white/5 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Slide 0: Overview */}
              {slide === 0 && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <h2 className="text-3xl font-bold text-purple-400">Your Month</h2>
                  <p className="text-5xl font-bold text-white">{data.totalLogs}</p>
                  <p className="text-gray-400">moods logged</p>
                  <p className="text-lg text-gray-300">Average intensity: <span className="font-bold text-white">{data.averageIntensity}/10</span></p>
                </div>
              )}

              {/* Slide 1: Emotion Distribution */}
              {slide === 1 && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Emotion Breakdown</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={data.emotionDistribution} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80}>
                        {data.emotionDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2">
                    {data.emotionDistribution.map((e) => (
                      <span key={e.emotion} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: e.color + '30', color: e.color }}>
                        {EMOTIONS[e.emotion]?.icon} {e.label} {e.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 2: Weekly Timeline */}
              {slide === 2 && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Weekly Valence</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.weeklyAverages}>
                      <XAxis dataKey="week" tick={{ fill: '#9ca3af' }} tickFormatter={(w) => `W${w}`} />
                      <YAxis tick={{ fill: '#9ca3af' }} domain={[-1, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgValence" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Slide 3: Highlights */}
              {slide === 3 && (
                <div className="flex flex-col gap-6 text-center">
                  <h2 className="text-xl font-bold text-white">Highlights</h2>
                  {data.happiestDay && (
                    <div>
                      <p className="text-sm text-gray-400">Happiest Day</p>
                      <p className="text-2xl">{EMOTIONS[data.happiestDay.emotion]?.icon}</p>
                      <p className="text-sm text-gray-300">
                        {new Date(data.happiestDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {data.saddestDay && (
                    <div>
                      <p className="text-sm text-gray-400">Toughest Day</p>
                      <p className="text-2xl">{EMOTIONS[data.saddestDay.emotion]?.icon}</p>
                      <p className="text-sm text-gray-300">
                        {new Date(data.saddestDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Slide 4: Streak */}
              {slide === 4 && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <h2 className="text-xl font-bold text-white">Your Streak</h2>
                  <p className="text-6xl">🔥</p>
                  <p className="text-4xl font-bold text-orange-400">{data.currentStreak} days</p>
                  <p className="text-gray-400">Longest ever: {data.longestStreak} days</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSlide((s) => Math.max(0, s - 1))} disabled={slide === 0}>
            ← Back
          </Button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i === slide ? 'bg-purple-500' : 'bg-white/20'}`} />
            ))}
          </div>
          <Button variant="ghost" onClick={() => setSlide((s) => Math.min(SLIDES.length - 1, s + 1))} disabled={slide === SLIDES.length - 1}>
            Next →
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};
