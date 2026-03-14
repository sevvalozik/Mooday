import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { EMOTIONS } from '../utils/emotionConfig.js';
import * as moodService from '../services/moodService.js';

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tümü' },
  { key: 'happiness', label: '☀️ Mutlu' },
  { key: 'sadness', label: '🌧️ Üzgün' },
  { key: 'anger', label: '⛈️ Sinirli' },
  { key: 'calm', label: '🌿 Sakin' },
  { key: 'excitement', label: '✨ Heyecanlı' },
  { key: 'anxiety', label: '🌀 Endişeli' },
  { key: 'tired', label: '🌙 Yorgun' },
  { key: 'hopeful', label: '🌅 Umutlu' },
];

export const MoodHistory = () => {
  const sphereStyle = useAuthStore((s) => s.sphereStyle);
  const [allLogs, setAllLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const load = async (p = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await moodService.getHistory(p, 15);
      const data = res.data || [];
      if (reset || p === 1) {
        setAllLogs(data);
      } else {
        setAllLogs((prev) => [...prev, ...data]);
      }
      setTotalPages(res.pagination?.totalPages || 1);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, true);
  }, []);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next);
  };

  const filtered = filter === 'all' ? allLogs : allLogs.filter((l) => l.emotion === filter);

  // Group by date
  const grouped = {};
  filtered.forEach((log) => {
    const dateKey = new Date(log.createdAt).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(log);
  });

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Duygu Geçmişi</h1>
            <p className="text-sm text-gray-500 mt-1">Toplam {total} kayıt</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Selected Log — Sphere Preview */}
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold" style={{ color: (EMOTIONS[selectedLog.emotion] || EMOTIONS.calm).color }}>
                  {(EMOTIONS[selectedLog.emotion] || EMOTIONS.calm).icon}{' '}
                  {(EMOTIONS[selectedLog.emotion] || EMOTIONS.calm).label}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(selectedLog.createdAt).toLocaleDateString('tr-TR', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/10"
              >
                Kapat
              </button>
            </div>
            <div className="flex justify-center">
              <MoodSphere
                emotion={selectedLog.emotion}
                intensity={selectedLog.intensity}
                size="medium"
                style={sphereStyle}
              />
            </div>
            {selectedLog.journal && (
              <p className="mt-4 rounded-lg bg-white/5 px-4 py-3 text-sm text-gray-300 italic border border-white/5">
                "{selectedLog.journal}"
              </p>
            )}
          </motion.div>
        )}

        {/* Grouped History */}
        {Object.entries(grouped).map(([dateKey, logs]) => (
          <div key={dateKey}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{dateKey}</h3>
            <div className="flex flex-col gap-2">
              {logs.map((log, i) => {
                const cfg = EMOTIONS[log.emotion] || EMOTIONS.calm;
                const isSelected = selectedLog?.id === log.id;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    onClick={() => setSelectedLog(isSelected ? null : log)}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
                      isSelected
                        ? 'border-purple-500/30 bg-purple-500/10'
                        : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    {/* Emotion sphere mini */}
                    <div
                      className="h-10 w-10 shrink-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${cfg.color}ee, ${cfg.color}66)`,
                        boxShadow: `0 0 12px ${cfg.color}40`,
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(log.createdAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {log.journal && (
                        <p className="mt-0.5 truncate text-xs text-gray-500 italic">
                          {log.journal}
                        </p>
                      )}
                    </div>

                    {/* Intensity bar */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">{log.intensity}/10</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${log.intensity * 10}%`,
                            backgroundColor: cfg.color,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">
              {filter !== 'all' ? 'Bu duygu kategorisinde kayıt bulunamadı' : 'Henüz duygu kaydı yok'}
            </p>
          </div>
        )}

        {/* Load More */}
        {page < totalPages && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mx-auto rounded-xl bg-white/5 px-6 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : 'Daha fazla yükle'}
          </button>
        )}
      </div>
    </PageWrapper>
  );
};
