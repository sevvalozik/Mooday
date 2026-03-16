import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';
import * as insightService from '../services/insightService.js';

const SLIDES = ['overview', 'galaxy', 'distribution', 'timeline', 'highlights', 'streak'];

const useTheme = () => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
};

/* ─── Enhanced Galaxy Component ─── */
const MoodGalaxy = ({ dailyMoods = [], daysInMonth = 30 }) => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate star positions once
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 0.5 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    })), []);

  // Build a map of day number → mood data
  const dayMap = useMemo(() => {
    const m = {};
    dailyMoods.forEach((d) => { m[d.day] = d; });
    return m;
  }, [dailyMoods]);

  // Calculate positions for ALL days (1 to daysInMonth)
  const dayPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < daysInMonth; i++) {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const angle = i * goldenAngle;
      const radius = 25 + Math.sqrt(i / daysInMonth) * 115;
      const x = 160 + Math.cos(angle) * radius;
      const y = 160 + Math.sin(angle) * radius;
      positions.push({ day: i + 1, x, y });
    }
    return positions;
  }, [daysInMonth]);

  // Orbit rings for weeks (4 concentric circles)
  const orbitRings = [55, 85, 110, 135];

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>Ayın Galaksisi</h2>
      <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Her küre bir günü temsil ediyor</p>

      <div
        className="relative mx-auto overflow-hidden rounded-2xl"
        style={{
          height: 360, width: 360,
          background: isLight
            ? 'radial-gradient(ellipse at 40% 30%, #e0e7ff 0%, #f0f4ff 40%, #f8fafc 100%)'
            : 'radial-gradient(ellipse at 40% 30%, #1a103d 0%, #0d0a1a 50%, #050510 100%)',
        }}
      >
        {/* Stars (dark mode) / Sparkles (light mode) */}
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              backgroundColor: isLight ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.7)',
              animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {/* Nebula glow */}
        <div className="absolute inset-0" style={{
          background: isLight
            ? 'radial-gradient(circle at 65% 40%, rgba(139,92,246,0.08), transparent 50%), radial-gradient(circle at 30% 70%, rgba(236,72,153,0.06), transparent 45%)'
            : 'radial-gradient(circle at 65% 40%, rgba(139,92,246,0.15), transparent 50%), radial-gradient(circle at 30% 70%, rgba(236,72,153,0.1), transparent 45%)',
        }} />

        {/* Orbit rings */}
        {orbitRings.map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: 160 - r,
              top: 160 - r,
              width: r * 2,
              height: r * 2,
              border: `1px solid ${isLight ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.06)'}`,
            }}
          />
        ))}

        {/* Connection lines (SVG) */}
        <svg className="absolute inset-0" width="360" height="360" style={{ pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isLight ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.08)'} />
              <stop offset="100%" stopColor={isLight ? 'rgba(236,72,153,0.2)' : 'rgba(139,92,246,0.15)'} />
            </linearGradient>
          </defs>
          {dayPositions.map((pos, i) => {
            if (i === 0) return null;
            const prev = dayPositions[i - 1];
            const hasCurrent = dayMap[pos.day];
            const hasPrev = dayMap[prev.day];
            if (!hasCurrent || !hasPrev) return null;
            return (
              <line
                key={i}
                x1={prev.x} y1={prev.y}
                x2={pos.x} y2={pos.y}
                stroke="url(#lineGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            );
          })}
        </svg>

        {/* Day spheres + empty placeholders */}
        {dayPositions.map((pos, i) => {
          const mood = dayMap[pos.day];
          if (!mood) {
            // Empty day placeholder
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                className="absolute rounded-full"
                style={{
                  left: pos.x - 4,
                  top: pos.y - 4,
                  width: 8,
                  height: 8,
                  backgroundColor: isLight ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.08)',
                  border: `1px dashed ${isLight ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.1)'}`,
                }}
                title={`Gün ${pos.day}: Veri yok`}
              />
            );
          }

          const emotion = mood.dominantEmotion || 'calm';
          const cfg = EMOTIONS[emotion] || EMOTIONS.calm;
          const size = 24 + (mood.intensity || 5) * 2;
          const isHovered = hoveredDay === pos.day;

          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
              className="absolute flex items-center justify-center rounded-full cursor-pointer"
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
                background: `radial-gradient(circle at 30% 30%, ${cfg.color}ff, ${cfg.color}bb 60%, ${cfg.color}66)`,
                boxShadow: isHovered
                  ? `0 0 ${size}px ${cfg.color}aa, 0 0 ${size * 2}px ${cfg.color}44, inset 0 -2px 6px ${cfg.color}60`
                  : `0 0 ${size * 0.6}px ${cfg.color}55, inset 0 -2px 4px ${cfg.color}40`,
                animation: `spherePulse ${3 + (i % 3)}s ease-in-out ${(i * 0.3) % 3}s infinite`,
                transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                zIndex: isHovered ? 20 : 1,
              }}
              onMouseEnter={() => setHoveredDay(pos.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span style={{ fontSize: Math.max(10, size * 0.35), filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
                {cfg.icon}
              </span>

              {/* Hover tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute rounded-xl px-3 py-2 text-center whitespace-nowrap pointer-events-none"
                  style={{
                    bottom: size + 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,10,30,0.95)',
                    border: `1px solid ${cfg.color}44`,
                    boxShadow: `0 4px 20px ${cfg.color}30`,
                    zIndex: 30,
                  }}
                >
                  <p className={`text-xs font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>
                    Gün {pos.day}
                  </p>
                  <p style={{ color: cfg.color }} className="text-xs font-medium">
                    {cfg.icon} {cfg.label}
                  </p>
                  <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                    Yoğunluk: {mood.intensity || '?'}/10
                  </p>
                  {/* Tooltip arrow */}
                  <div
                    className="absolute left-1/2 -bottom-1.5"
                    style={{
                      width: 8, height: 8,
                      transform: 'translateX(-50%) rotate(45deg)',
                      backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,10,30,0.95)',
                      borderRight: `1px solid ${cfg.color}44`,
                      borderBottom: `1px solid ${cfg.color}44`,
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {Object.entries(EMOTIONS).map(([key, cfg]) => (
          <span key={key} className={`flex items-center gap-1 text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{
              backgroundColor: cfg.color,
              boxShadow: `0 0 4px ${cfg.color}66`,
            }} />
            {cfg.label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes spherePulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.15); }
        }
      `}</style>
    </div>
  );
};

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
        <div className="flex items-center justify-center py-20 text-gray-400">Yükleniyor...</div>
      </PageWrapper>
    );
  }

  if (!data || data.totalLogs === 0) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-gray-400">Bu ay için henüz veri yok.</div>
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
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Aylık Özet</h1>

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
                  <h2 className="text-3xl font-bold text-purple-400">Ayın Özeti</h2>
                  <p className="text-5xl font-bold text-white">{data.totalLogs}</p>
                  <p className="text-gray-400">ruh hali kaydedildi</p>
                  <p className="text-lg text-gray-300">Ortalama yoğunluk: <span className="font-bold text-white">{data.averageIntensity}/10</span></p>
                </div>
              )}

              {/* Slide 1: 30-Day Galaxy */}
              {slide === 1 && (
                <MoodGalaxy
                  dailyMoods={data.dailyMoods}
                  daysInMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
                />
              )}

              {/* Slide 2: Emotion Distribution */}
              {slide === 2 && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Duygu Dağılımı</h2>
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

              {/* Slide 3: Weekly Timeline */}
              {slide === 3 && (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Haftalık Duygu Grafiği</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.weeklyAverages}>
                      <XAxis dataKey="week" tick={{ fill: '#9ca3af' }} tickFormatter={(w) => `H${w}`} />
                      <YAxis tick={{ fill: '#9ca3af' }} domain={[-1, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgValence" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Slide 4: Highlights */}
              {slide === 4 && (
                <div className="flex flex-col gap-6 text-center">
                  <h2 className="text-xl font-bold text-white">Öne Çıkanlar</h2>
                  {data.happiestDay && (
                    <div>
                      <p className="text-sm text-gray-400">En Mutlu Gün</p>
                      <p className="text-2xl">{EMOTIONS[data.happiestDay.emotion]?.icon}</p>
                      <p className="text-sm text-gray-300">
                        {new Date(data.happiestDay.date).toLocaleDateString('tr-TR', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {data.saddestDay && (
                    <div>
                      <p className="text-sm text-gray-400">En Zor Gün</p>
                      <p className="text-2xl">{EMOTIONS[data.saddestDay.emotion]?.icon}</p>
                      <p className="text-sm text-gray-300">
                        {new Date(data.saddestDay.date).toLocaleDateString('tr-TR', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Slide 5: Streak */}
              {slide === 5 && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <h2 className="text-xl font-bold text-white">Seri</h2>
                  <p className="text-6xl">🔥</p>
                  <p className="text-4xl font-bold text-orange-400">{data.currentStreak} gün</p>
                  <p className="text-gray-400">En uzun seri: {data.longestStreak} gün</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSlide((s) => Math.max(0, s - 1))} disabled={slide === 0}>
            ← Geri
          </Button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${i === slide ? 'bg-purple-500' : 'bg-white/20'}`} />
            ))}
          </div>
          <Button variant="ghost" onClick={() => setSlide((s) => Math.min(SLIDES.length - 1, s + 1))} disabled={slide === SLIDES.length - 1}>
            İleri →
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};
