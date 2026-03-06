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

export const EMOTION_KEYS = Object.keys(EMOTIONS);
