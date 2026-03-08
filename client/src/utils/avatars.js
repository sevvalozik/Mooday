// Pre-designed avatar options for users to pick from
// Each avatar is stored as a key string in the database (avatarUrl field)

export const AVATAR_OPTIONS = [
  // Animals
  { key: 'cat', label: 'Cat', emoji: '🐱', bg: 'from-purple-500 to-pink-500' },
  { key: 'dog', label: 'Dog', emoji: '🐶', bg: 'from-amber-500 to-orange-500' },
  { key: 'fox', label: 'Fox', emoji: '🦊', bg: 'from-orange-500 to-red-500' },
  { key: 'panda', label: 'Panda', emoji: '🐼', bg: 'from-gray-500 to-gray-700' },
  { key: 'bunny', label: 'Bunny', emoji: '🐰', bg: 'from-pink-400 to-rose-500' },
  { key: 'bear', label: 'Bear', emoji: '🐻', bg: 'from-amber-600 to-yellow-700' },
  { key: 'koala', label: 'Koala', emoji: '🐨', bg: 'from-gray-400 to-blue-400' },
  { key: 'penguin', label: 'Penguin', emoji: '🐧', bg: 'from-blue-500 to-indigo-600' },
  // Nature & Space
  { key: 'star', label: 'Star', emoji: '⭐', bg: 'from-yellow-400 to-amber-500' },
  { key: 'moon', label: 'Moon', emoji: '🌙', bg: 'from-indigo-500 to-purple-600' },
  { key: 'sun', label: 'Sun', emoji: '☀️', bg: 'from-yellow-400 to-orange-500' },
  { key: 'rainbow', label: 'Rainbow', emoji: '🌈', bg: 'from-red-400 via-yellow-400 to-blue-400' },
  { key: 'flower', label: 'Flower', emoji: '🌸', bg: 'from-pink-400 to-rose-400' },
  { key: 'tree', label: 'Tree', emoji: '🌳', bg: 'from-green-500 to-emerald-600' },
  { key: 'ocean', label: 'Ocean', emoji: '🌊', bg: 'from-cyan-500 to-blue-600' },
  { key: 'fire', label: 'Fire', emoji: '🔥', bg: 'from-red-500 to-orange-500' },
  // Objects & Fun
  { key: 'rocket', label: 'Rocket', emoji: '🚀', bg: 'from-blue-600 to-violet-600' },
  { key: 'crystal', label: 'Crystal', emoji: '💎', bg: 'from-cyan-400 to-blue-500' },
  { key: 'music', label: 'Music', emoji: '🎵', bg: 'from-violet-500 to-purple-600' },
  { key: 'ghost', label: 'Ghost', emoji: '👻', bg: 'from-gray-400 to-slate-500' },
  { key: 'alien', label: 'Alien', emoji: '👽', bg: 'from-green-400 to-emerald-500' },
  { key: 'robot', label: 'Robot', emoji: '🤖', bg: 'from-slate-500 to-zinc-600' },
  { key: 'unicorn', label: 'Unicorn', emoji: '🦄', bg: 'from-pink-500 to-violet-500' },
  { key: 'butterfly', label: 'Butterfly', emoji: '🦋', bg: 'from-blue-400 to-purple-500' },
];

export const getAvatar = (avatarKey) => {
  return AVATAR_OPTIONS.find((a) => a.key === avatarKey) || null;
};

export const getAvatarEmoji = (avatarKey) => {
  const avatar = getAvatar(avatarKey);
  return avatar ? avatar.emoji : null;
};

export const getAvatarBg = (avatarKey) => {
  const avatar = getAvatar(avatarKey);
  return avatar ? avatar.bg : 'from-purple-500 to-pink-500';
};
