import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  sphereStyle: localStorage.getItem('sphereStyle') || 'default',

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, token: accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  setSphereStyle: (style) => {
    localStorage.setItem('sphereStyle', style);
    set({ sphereStyle: style });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
}));
