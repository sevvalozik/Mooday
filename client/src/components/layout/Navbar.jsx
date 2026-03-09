import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { useNotificationStore } from '../../stores/notificationStore.js';
import { UserAvatar } from '../ui/UserAvatar.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="text-lg font-bold text-white sm:text-xl">
          Mooday
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/mood/new" className="hidden rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 sm:block">
              Kaydet
            </Link>
            <Link to="/messages" className="hidden text-gray-400 transition-colors hover:text-white md:block">
              Mesajlar
            </Link>
            <Link to="/notifications" className="relative text-gray-400 transition-colors hover:text-white">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white sm:h-5 sm:w-5 sm:text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/profile">
              <UserAvatar user={user} size="xs" />
            </Link>
            <button onClick={handleLogout} className="hidden text-sm text-gray-400 transition-colors hover:text-white sm:block">
              Çıkış
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-300 transition-colors hover:text-white">
              Giriş
            </Link>
            <Link to="/register" className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 sm:px-4 sm:py-2">
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
