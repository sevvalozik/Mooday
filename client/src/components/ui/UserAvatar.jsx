import { getAvatar } from '../../utils/avatars.js';

const SIZE_MAP = {
  xs: 'h-7 w-7 text-sm',
  sm: 'h-9 w-9 text-base',
  md: 'h-10 w-10 text-lg',
  lg: 'h-12 w-12 text-xl',
  xl: 'h-16 w-16 text-2xl',
};

export const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const avatar = user?.avatarUrl ? getAvatar(user.avatarUrl) : null;

  if (avatar) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br ${avatar.bg} ${sizeClass} ${className}`}
      >
        {avatar.emoji}
      </div>
    );
  }

  // Fallback to initials
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || '?';
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-purple-600 font-bold text-white ${sizeClass} ${className}`}
    >
      {initial}
    </div>
  );
};
