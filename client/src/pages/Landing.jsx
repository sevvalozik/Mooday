import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';

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

const CYCLE_EMOTIONS = ['happiness', 'sadness', 'calm', 'excitement', 'anxiety', 'hopeful'];
const SPHERE_STYLES = ['default', 'crystal'];

const FeatureIcon = ({ type }) => {
  const paths = {
    sphere: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 3v18 M3 12h18 M5.636 5.636l12.728 12.728 M18.364 5.636L5.636 18.364',
    galaxy: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
    chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    heart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
    chat: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
    music: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V4.846a2.25 2.25 0 00-1.632-2.163l-6-1.714A2.25 2.25 0 004.5 3.132v15.12a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66A2.25 2.25 0 004.5 14.502V9',
  };
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
};

const features = [
  { title: 'Canlı 3D Küre', desc: 'Duyguların özel GLSL shader\'larla nefes alan, animasyonlu bir küre olarak görselleştirilir', iconType: 'sphere' },
  { title: 'Arkadaş Galaksisi', desc: 'Arkadaşlarının duygusal durumlarını interaktif 3D takımyıldızında gör', iconType: 'galaxy' },
  { title: 'Duygu Analizleri', desc: 'Yapay zeka destekli haftalık raporlar, trend analizi ve duygusal uyumluluk', iconType: 'chart' },
  { title: 'Anlık Tepkiler', desc: 'Arkadaşlarına gerçek zamanlı sarılma, tezahürat ve çak gönder', iconType: 'heart' },
  { title: 'Meme Paylaşımı', desc: 'Ruh haline uygun memelerle kendini ifade et', iconType: 'chat' },
  { title: 'Müzik Paylaşımı', desc: 'Ruh haline uygun şarkıları arkadaşlarınla paylaş', iconType: 'music' },
];

const stats = [
  { value: '8', label: 'Duygu' },
  { value: '2', label: 'Küre Stili' },
  { value: '∞', label: 'Takip Edilecek' },
];

export const Landing = () => {
  const theme = useTheme();
  const isLight = theme === 'light';
  const [currentEmotion, setCurrentEmotion] = useState('happiness');
  const [emotionIndex, setEmotionIndex] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotionIndex((i) => {
        const next = (i + 1) % CYCLE_EMOTIONS.length;
        setCurrentEmotion(CYCLE_EMOTIONS[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStyleIndex((i) => (i + 1) % SPHERE_STYLES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const config = EMOTIONS[currentEmotion] || EMOTIONS.calm;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Animated background gradient */}
      <div className="pointer-events-none fixed inset-0">
        <div className={`absolute inset-0 ${isLight ? 'bg-gradient-to-b from-purple-100/40 via-white to-white' : 'bg-gradient-to-b from-purple-950/30 via-gray-950 to-gray-950'}`} />
        <motion.div
          animate={{
            background: [
              `radial-gradient(600px circle at 50% 30%, ${config.color}${isLight ? '12' : '15'}, transparent 70%)`,
              `radial-gradient(800px circle at 50% 30%, ${config.color}${isLight ? '08' : '10'}, transparent 70%)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
        <span className="text-xl font-bold text-white sm:text-2xl">
          Mood<span className="text-purple-400">ay</span>
        </span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 transition-colors hover:text-white">
            Giriş Yap
          </Link>
          <Link to="/register" className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500">
            Ücretsiz Kayıt Ol
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 sm:min-h-[90vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="mb-6"
          >
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              Duyguların, 3D'de canlı
            </span>
          </motion.div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Mood<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ay</span>
          </h1>
          <p className="mb-10 max-w-md text-base text-gray-400 sm:max-w-lg sm:text-lg">
            Ruh halini canlı bir 3D küre olarak takip et, arkadaşlarınla galakside buluş ve duygusal kalıplarını keşfet.
          </p>

          {/* Sphere with emotion label */}
          <div className="relative mb-8">
            <MoodSphere
              emotion={currentEmotion}
              intensity={7}
              size="large"
              interactive={false}
              style={SPHERE_STYLES[styleIndex]}
            />
            <motion.div
              key={currentEmotion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
            >
              <span
                className="rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: config.color + '40', color: config.color, backgroundColor: config.color + '15' }}
              >
                {config.icon} {config.label}
              </span>
            </motion.div>
          </div>

          {/* Style indicator */}
          <div className="mb-8 flex gap-2">
            {SPHERE_STYLES.map((s, i) => (
              <button
                key={s}
                onClick={() => setStyleIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === styleIndex ? 'w-6 bg-purple-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-xl bg-purple-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25 sm:text-lg"
            >
              <span className="relative z-10">Başla</span>
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/5 sm:text-lg"
            >
              Giriş Yap
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-purple-400 sm:text-4xl">{stat.value}</p>
              <p className="text-xs text-gray-500 sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Duygularını Deneyimle
          </h2>
          <p className="mx-auto max-w-md text-gray-500">
            Sadece takip değil — ruh hallerini anlamanın görsel, sosyal ve analitik yolu.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-purple-500/20 hover:bg-white/[0.07] sm:p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-transform group-hover:scale-110">
                <FeatureIcon type={feature.iconType} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/10 p-8 text-center backdrop-blur-sm sm:p-12"
        >
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Ruh halinin canlanmasını görmeye hazır mısın?</h2>
          <p className="mb-6 text-gray-400">Mooday'e katıl ve duygusal yolculuğunu görselleştirmeye başla.</p>
          <Link
            to="/register"
            className="inline-block rounded-xl bg-purple-600 px-8 py-3.5 text-lg font-semibold text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Ücretsiz Başla
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-4 py-8 text-center">
        <p className="text-sm text-gray-600">
          Mooday — Sosyal Ruh Hali Takip Platformu
        </p>
      </footer>
    </div>
  );
};
