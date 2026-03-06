import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Galaxy', icon: '🌌' },
  { to: '/profile', label: 'Profile', icon: '🔮' },
  { to: '/mood/new', label: 'Log Mood', icon: '✨' },
  { to: '/friends', label: 'Friends', icon: '🤝' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/groups', label: 'Groups', icon: '👥' },
  { to: '/summary', label: 'Summary', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 z-40 hidden w-56 border-r border-white/10 bg-gray-950/50 backdrop-blur-sm lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600/20 text-purple-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
