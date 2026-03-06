export const EMOTIONS = {
  happiness:  { color: '#FFD700', valence:  0.8, arousal: 0.5, label: 'Happy',   icon: '☀️' },
  sadness:    { color: '#4169E1', valence: -0.7, arousal: 0.2, label: 'Sad',     icon: '🌧️' },
  anger:      { color: '#DC143C', valence: -0.8, arousal: 0.9, label: 'Angry',   icon: '⛈️' },
  calm:       { color: '#2E8B57', valence:  0.5, arousal: 0.1, label: 'Calm',    icon: '🌿' },
  excitement: { color: '#FF8C00', valence:  0.9, arousal: 0.9, label: 'Excited', icon: '✨' },
  anxiety:    { color: '#8B008B', valence: -0.5, arousal: 0.8, label: 'Anxious', icon: '🌀' },
  tired:      { color: '#708090', valence: -0.2, arousal: 0.1, label: 'Tired',   icon: '🌙' },
  hopeful:    { color: '#FF69B4', valence:  0.6, arousal: 0.4, label: 'Hopeful', icon: '🌅' },
};

const hexToRgbFloat = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
};

const COLOR_PAIRS = {
  happiness:  { colorA: '#FFD700', colorB: '#FF8C00' },
  sadness:    { colorA: '#4169E1', colorB: '#1E3C96' },
  anger:      { colorA: '#DC143C', colorB: '#8B0000' },
  calm:       { colorA: '#2E8B57', colorB: '#226941' },
  excitement: { colorA: '#FF8C00', colorB: '#FF4500' },
  anxiety:    { colorA: '#8B008B', colorB: '#4B0082' },
  tired:      { colorA: '#708090', colorB: '#485260' },
  hopeful:    { colorA: '#FF69B4', colorB: '#FF9F7A' },
};

export const getEmotionColors = (emotion) => {
  const pair = COLOR_PAIRS[emotion] || COLOR_PAIRS.calm;
  return {
    colorA: hexToRgbFloat(pair.colorA),
    colorB: hexToRgbFloat(pair.colorB),
  };
};

export const getEmotionVisuals = (emotion, intensity = 5) => {
  const config = EMOTIONS[emotion] || EMOTIONS.calm;
  const colors = getEmotionColors(emotion);
  const normalizedIntensity = intensity / 10;

  return {
    ...config,
    ...colors,
    normalizedIntensity,
    background: emotion,
  };
};

export const EMOTION_LIST = Object.entries(EMOTIONS).map(([key, value]) => ({
  key,
  ...value,
}));
