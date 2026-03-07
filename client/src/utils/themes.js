export const THEMES = {
  dark: { name: 'Midnight', preview: ['#050810', '#8b5cf6', '#1e1b4b'] },
  light: { name: 'Daylight', preview: ['#f8fafc', '#7c3aed', '#e2e8f0'] },
  cosmic: { name: 'Nebula', preview: ['#080016', '#ec4899', '#2e1065'] },
  sunset: { name: 'Golden Hour', preview: ['#0a0805', '#f97316', '#451a03'] },
};

export const applyTheme = (themeName) => {
  const name = THEMES[themeName] ? themeName : 'dark';
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('theme', name);
};

export const loadSavedTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved && THEMES[saved]) {
    applyTheme(saved);
    return saved;
  }
  applyTheme('dark');
  return 'dark';
};

export const THEME_LIST = Object.entries(THEMES).map(([key, value]) => ({
  key,
  name: value.name,
  preview: value.preview,
}));
