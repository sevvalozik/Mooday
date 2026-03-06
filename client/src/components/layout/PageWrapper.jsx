import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { MoodBackground } from '../effects/MoodBackground.jsx';
import { useMoodStore } from '../../stores/moodStore.js';

export const PageWrapper = ({ children, showSidebar = true }) => {
  const currentMood = useMoodStore((s) => s.currentMood);

  return (
    <div className="min-h-screen">
      <MoodBackground emotion={currentMood?.emotion} />
      <Navbar />
      {showSidebar && <Sidebar />}
      <main className={`pt-14 sm:pt-16 ${showSidebar ? 'lg:pl-56' : ''}`}>
        <div className="mx-auto max-w-5xl px-3 py-4 pb-20 sm:px-4 sm:py-6 lg:pb-6">
          {children}
        </div>
      </main>
      {showSidebar && <MobileNav />}
    </div>
  );
};
