import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';

const CYCLE_EMOTIONS = ['happiness', 'sadness', 'calm', 'excitement', 'anxiety', 'hopeful'];
const SPHERE_STYLES = ['default', 'crystal', 'nebula', 'wireframe'];

const features = [
  { title: 'Living 3D Sphere', desc: 'Your emotions visualized as a breathing, animated sphere with custom GLSL shaders', icon: '🔮' },
  { title: 'Friend Galaxy', desc: "See your friends' emotional states in an interactive 3D constellation", icon: '🌌' },
  { title: 'Mood Insights', desc: 'AI-powered weekly reports, trend detection, and emotional compatibility', icon: '📊' },
  { title: 'Real-time Reactions', desc: 'Send hugs, cheers, and high-fives to friends in real-time', icon: '🤗' },
  { title: 'Meme Sharing', desc: 'Express yourself with mood memes — send the perfect reaction to friends', icon: '😂' },
  { title: 'Music Sharing', desc: 'Share songs that match your mood with friends', icon: '🎵' },
];

const stats = [
  { value: '8', label: 'Emotions' },
  { value: '4', label: 'Sphere Styles' },
  { value: '∞', label: 'Moods to Track' },
];

export const Landing = () => {
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
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-gray-950 to-gray-950" />
        <motion.div
          animate={{
            background: [
              `radial-gradient(600px circle at 50% 30%, ${config.color}15, transparent 70%)`,
              `radial-gradient(800px circle at 50% 30%, ${config.color}10, transparent 70%)`,
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
            Login
          </Link>
          <Link to="/register" className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500">
            Sign Up Free
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
              Your emotions, alive in 3D
            </span>
          </motion.div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Mood<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ay</span>
          </h1>
          <p className="mb-10 max-w-md text-base text-gray-400 sm:max-w-lg sm:text-lg">
            Track your mood as a living 3D sphere, connect with friends in a galaxy, and discover your emotional patterns.
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
              <span className="relative z-10">Start Tracking</span>
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/5 sm:text-lg"
            >
              Login
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
            Experience Your Emotions
          </h2>
          <p className="mx-auto max-w-md text-gray-500">
            More than tracking — a visual, social, and insightful way to understand your moods.
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
              <span className="mb-3 block text-3xl transition-transform group-hover:scale-110">{feature.icon}</span>
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
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Ready to see your mood come alive?</h2>
          <p className="mb-6 text-gray-400">Join Mooday and start visualizing your emotional journey today.</p>
          <Link
            to="/register"
            className="inline-block rounded-xl bg-purple-600 px-8 py-3.5 text-lg font-semibold text-white transition-all hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-4 py-8 text-center">
        <p className="text-sm text-gray-600">
          Mooday — Social Mood Tracking Platform
        </p>
      </footer>
    </div>
  );
};
