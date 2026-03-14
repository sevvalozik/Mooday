import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { MoodBackground } from '../effects/MoodBackground.jsx';
import { useMoodStore } from '../../stores/moodStore.js';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
};

export const PageWrapper = ({ children, showSidebar = true }) => {
  const currentMood = useMoodStore((s) => s.currentMood);
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <MoodBackground emotion={currentMood?.emotion} />
      <Navbar />
      {showSidebar && <Sidebar />}
      <main className={`pt-14 sm:pt-16 ${showSidebar ? 'lg:pl-56' : ''}`}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="mx-auto max-w-5xl px-3 py-4 pb-20 sm:px-4 sm:py-6 lg:pb-6"
        >
          {children}
        </motion.div>
      </main>
      {showSidebar && <MobileNav />}
    </div>
  );
};
