import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';
import * as insightService from '../services/insightService.js';

const DAY_TR = {
  Monday: 'Pzt',
  Tuesday: 'Sal',
  Wednesday: 'Çar',
  Thursday: 'Per',
  Friday: 'Cum',
  Saturday: 'Cmt',
  Sunday: 'Paz',
};

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const valenceColor = (v) => {
  if (v === null || v === undefined) return '#374151';
  if (v >= 0.5) return EMOTIONS.happiness.color;
  if (v >= 0) return EMOTIONS.calm.color;
  if (v >= -0.5) return EMOTIONS.tired.color;
  return EMOTIONS.sadness.color;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-white">{d.dayTR}</p>
      <p className="text-gray-400">
        Valence: <span className="text-white">{d.avgValence !== null ? d.avgValence.toFixed(2) : 'Veri yok'}</span>
      </p>
    </div>
  );
};

export const WeeklyInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insightService
      .getWeeklyInsights()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20 text-gray-400">Yükleniyor...</div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-gray-400">Haftalık analiz verisi bulunamadı.</div>
      </PageWrapper>
    );
  }

  const chartData = DAY_ORDER.map((day) => {
    const found = data.dayPatterns?.find((d) => d.day === day);
    return {
      day: DAY_TR[day],
      dayTR: DAY_TR[day],
      avgValence: found?.avgValence ?? null,
    };
  });

  const bestDay = data.dayPatterns
    ?.filter((d) => d.avgValence !== null)
    .sort((a, b) => b.avgValence - a.avgValence)[0];

  const worstDay = data.dayPatterns
    ?.filter((d) => d.avgValence !== null)
    .sort((a, b) => a.avgValence - b.avgValence)[0];

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-white">Haftalık Analiz</h1>
        <p className="mb-6 text-sm text-gray-400">{data.weatherReport}</p>

        {/* Trend & Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <p className="text-4xl mb-1">
              {data.trend?.direction === 'up' ? '📈' : data.trend?.direction === 'down' ? '📉' : '➡️'}
            </p>
            <p className="text-lg font-bold text-white">
              {data.trend?.direction === 'up' ? 'Yükseliş' : data.trend?.direction === 'down' ? 'Düşüş' : 'Stabil'}
            </p>
            <p className="text-xs text-gray-500">{data.trend?.percentage}% değişim</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <p className="text-4xl font-bold text-purple-400 mb-1">{data.totalLogs}</p>
            <p className="text-sm text-gray-400">toplam kayıt</p>
            <p className="text-xs text-gray-500">son 14 gün</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <p className="text-4xl mb-1">🏆</p>
            <p className="text-lg font-bold text-white">{bestDay ? (DAY_TR[bestDay.day] || bestDay.day) : '—'}</p>
            <p className="text-xs text-gray-500">en iyi gün</p>
          </motion.div>
        </div>

        {/* Day Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Günlere Göre Ruh Hali</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[-1, 1]}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="avgValence" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={valenceColor(entry.avgValence)} opacity={entry.avgValence !== null ? 0.85 : 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: EMOTIONS.happiness.color }} />
              Pozitif
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: EMOTIONS.calm.color }} />
              Nötr
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: EMOTIONS.sadness.color }} />
              Negatif
            </span>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 grid gap-4 sm:grid-cols-2"
        >
          {bestDay && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-gray-400 mb-2">En İyi Günün</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                <div>
                  <p className="text-lg font-bold text-white">{DAY_TR[bestDay.day] || bestDay.day}</p>
                  <p className="text-xs text-gray-500">valence: {bestDay.avgValence?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          {worstDay && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-gray-400 mb-2">En Zor Günün</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌧️</span>
                <div>
                  <p className="text-lg font-bold text-white">{DAY_TR[worstDay.day] || worstDay.day}</p>
                  <p className="text-xs text-gray-500">valence: {worstDay.avgValence?.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Time Patterns */}
        {data.timePatterns && data.timePatterns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="mb-3 text-lg font-semibold text-white">Zaman Dilimine Göre</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.timePatterns.map((tp) => (
                <div key={tp.period} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
                  <span className="text-2xl">
                    {tp.period === 'morning' ? '🌅' : tp.period === 'afternoon' ? '☀️' : tp.period === 'evening' ? '🌆' : '🌙'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {tp.period === 'morning' ? 'Sabah' : tp.period === 'afternoon' ? 'Öğlen' : tp.period === 'evening' ? 'Akşam' : 'Gece'}
                    </p>
                    <p className="text-xs text-gray-500">{tp.count} kayıt · valence {tp.avgValence?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};
