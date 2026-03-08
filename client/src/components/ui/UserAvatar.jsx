import { parseAvatarConfig } from '../../utils/avatars.js';
import { AvatarRenderer } from './AvatarRenderer.jsx';

const SIZE_MAP = {
  xs: 28,
  sm: 36,
  md: 40,
  lg: 48,
  xl: 64,
};

const SIZE_CLASS = {
  xs: 'h-7 w-7',
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const TEXT_CLASS = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const avatarConfig = parseAvatarConfig(user?.avatarUrl);
  const px = SIZE_MAP[size] || SIZE_MAP.md;

  // If user has a custom avatar config, render it
  if (avatarConfig) {
    return <AvatarRenderer config={avatarConfig} size={px} className={className} />;
  }

  // Fallback to initials
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || '?';
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;
  const textClass = TEXT_CLASS[size] || TEXT_CLASS.md;

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-purple-600 font-bold text-white ${sizeClass} ${textClass} ${className}`}
    >
      {initial}
    </div>
  );
};
