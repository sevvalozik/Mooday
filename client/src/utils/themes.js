export const THEMES = {
  dark: { name: 'Gece Modu', preview: ['#050810', '#8b5cf6', '#1e1b4b'] },
  light: { name: 'Gündüz Modu', preview: ['#f8fafc', '#7c3aed', '#e2e8f0'] },
  cosmic: { name: 'Nebula', preview: ['#080016', '#ec4899', '#2e1065'] },
};

export const applyTheme = (themeName) => {
  const name = THEMES[themeName] ? themeName : 'cosmic';
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('theme', name);
};

export const loadSavedTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved && THEMES[saved]) {
    applyTheme(saved);
    return saved;
  }
  applyTheme('cosmic');
  return 'cosmic';
};

export const THEME_LIST = Object.entries(THEMES).map(([key, value]) => ({
  key,
  name: value.name,
  preview: value.preview,
}));
