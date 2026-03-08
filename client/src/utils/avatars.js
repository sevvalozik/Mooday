// Avatar configuration system — users build their own character

export const SKIN_TONES = [
  { key: 'light', color: '#FDDBB4', label: 'Light' },
  { key: 'light-med', color: '#F5C596', label: 'Light Medium' },
  { key: 'medium', color: '#D4A373', label: 'Medium' },
  { key: 'tan', color: '#C68642', label: 'Tan' },
  { key: 'dark', color: '#8D5524', label: 'Dark' },
  { key: 'deep', color: '#5C3317', label: 'Deep' },
];

export const FEMALE_HAIR_STYLES = [
  { key: 'f-short', label: 'Kısa' },
  { key: 'f-bob', label: 'Küt' },
  { key: 'f-long', label: 'Uzun' },
  { key: 'f-bun', label: 'Toplu' },
];

export const MALE_HAIR_STYLES = [
  { key: 'm-straight', label: 'Düz' },
  { key: 'm-curly', label: 'Kıvırcık' },
  { key: 'm-bald', label: 'Kel' },
];

export const HAIR_COLORS = [
  { key: 'black', color: '#1A1A2E', label: 'Black' },
  { key: 'dark-brown', color: '#3E2723', label: 'Dark Brown' },
  { key: 'brown', color: '#795548', label: 'Brown' },
  { key: 'blonde', color: '#FFD54F', label: 'Blonde' },
  { key: 'red', color: '#C0392B', label: 'Red' },
  { key: 'purple', color: '#8E44AD', label: 'Purple' },
  { key: 'blue', color: '#3498DB', label: 'Blue' },
  { key: 'pink', color: '#E91E63', label: 'Pink' },
];

export const EYE_STYLES = [
  { key: 'normal', label: 'Normal' },
  { key: 'happy', label: 'Happy' },
  { key: 'round', label: 'Round' },
  { key: 'wink', label: 'Wink' },
  { key: 'sleepy', label: 'Sleepy' },
];

export const MOUTH_STYLES = [
  { key: 'smile', label: 'Smile' },
  { key: 'grin', label: 'Grin' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'open', label: 'Open' },
  { key: 'cat', label: 'Cat' },
];

export const ACCESSORIES = [
  { key: 'none', label: 'None' },
  { key: 'glasses', label: 'Glasses' },
  { key: 'sunglasses', label: 'Sunglasses' },
  { key: 'blush', label: 'Blush' },
  { key: 'freckles', label: 'Freckles' },
];

export const BG_COLORS = [
  { key: 'purple', color: '#7C3AED', label: 'Purple' },
  { key: 'blue', color: '#3B82F6', label: 'Blue' },
  { key: 'pink', color: '#EC4899', label: 'Pink' },
  { key: 'green', color: '#10B981', label: 'Green' },
  { key: 'orange', color: '#F59E0B', label: 'Orange' },
  { key: 'red', color: '#EF4444', label: 'Red' },
  { key: 'teal', color: '#14B8A6', label: 'Teal' },
  { key: 'indigo', color: '#6366F1', label: 'Indigo' },
];

export const DEFAULT_AVATAR = {
  gender: 'female',
  bg: 'purple',
  skin: 'light-med',
  hair: 'f-long',
  hairColor: 'dark-brown',
  eyes: 'normal',
  mouth: 'smile',
  accessory: 'none',
};

export const parseAvatarConfig = (avatarUrl) => {
  if (!avatarUrl) return null;
  try {
    const parsed = JSON.parse(avatarUrl);
    if (parsed && typeof parsed === 'object' && parsed.skin) {
      return { ...DEFAULT_AVATAR, ...parsed };
    }
    return null;
  } catch {
    return null;
  }
};

export const serializeAvatarConfig = (config) => {
  return JSON.stringify(config);
};

export const getSkinColor = (key) => SKIN_TONES.find((s) => s.key === key)?.color || SKIN_TONES[1].color;
export const getHairColor = (key) => HAIR_COLORS.find((h) => h.key === key)?.color || HAIR_COLORS[1].color;
export const getBgColor = (key) => BG_COLORS.find((b) => b.key === key)?.color || BG_COLORS[0].color;
