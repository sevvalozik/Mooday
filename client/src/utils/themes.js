export const THEMES = {
  dark: {
    '--color-primary': '#8b5cf6',
    '--color-primary-light': '#a78bfa',
    '--color-primary-dark': '#7c3aed',
    '--color-bg': '#030712',
    '--color-surface': '#111827',
    '--color-surface-light': '#1f2937',
    '--color-text': '#f9fafb',
    '--color-text-muted': '#9ca3af',
    '--color-border': '#374151',
  },
  light: {
    '--color-primary': '#7c3aed',
    '--color-primary-light': '#8b5cf6',
    '--color-primary-dark': '#6d28d9',
    '--color-bg': '#f9fafb',
    '--color-surface': '#ffffff',
    '--color-surface-light': '#f3f4f6',
    '--color-text': '#111827',
    '--color-text-muted': '#6b7280',
    '--color-border': '#e5e7eb',
  },
  cosmic: {
    '--color-primary': '#ec4899',
    '--color-primary-light': '#f472b6',
    '--color-primary-dark': '#db2777',
    '--color-bg': '#0f0720',
    '--color-surface': '#1a0e33',
    '--color-surface-light': '#251547',
    '--color-text': '#f0e6ff',
    '--color-text-muted': '#a78bfa',
    '--color-border': '#3b1f6e',
  },
  sunset: {
    '--color-primary': '#f97316',
    '--color-primary-light': '#fb923c',
    '--color-primary-dark': '#ea580c',
    '--color-bg': '#1c0a00',
    '--color-surface': '#2d1400',
    '--color-surface-light': '#3d1e00',
    '--color-text': '#fff7ed',
    '--color-text-muted': '#fdba74',
    '--color-border': '#7c2d12',
  },
};

export const applyTheme = (themeName) => {
  const theme = THEMES[themeName] || THEMES.dark;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme)) {
    root.style.setProperty(key, value);
  }
};

export const THEME_LIST = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
  { key: 'cosmic', label: 'Cosmic' },
  { key: 'sunset', label: 'Sunset' },
];
