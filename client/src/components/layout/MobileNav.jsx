import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/dashboard', label: 'Galaxy', icon: '🌌' },
  { to: '/profile', label: 'Profile', icon: '🔮' },
  { to: '/mood/new', label: 'Log', icon: '✨' },
  { to: '/friends', label: 'Friends', icon: '🤝' },
  { to: '/messages', label: 'Chat', icon: '💬' },
];

export const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-gray-950/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around py-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
