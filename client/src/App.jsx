import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
import { ToastContainer } from './components/ui/Toast.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Profile } from './pages/Profile.jsx';
import { MoodLogger } from './pages/MoodLogger.jsx';
import { FriendProfile } from './pages/FriendProfile.jsx';
import { Messages } from './pages/Messages.jsx';
import { Groups } from './pages/Groups.jsx';
import { MonthlySummary } from './pages/MonthlySummary.jsx';
import { Settings } from './pages/Settings.jsx';
import { Notifications } from './pages/Notifications.jsx';
import { Friends } from './pages/Friends.jsx';
import { AvatarSetup } from './pages/AvatarSetup.jsx';
import { useSocket } from './hooks/useSocket.js';
import { useAuthStore } from './stores/authStore.js';
import { loadSavedTheme } from './utils/themes.js';
import api from './services/api.js';

export default function App() {
  useSocket();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Load saved theme on app start
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Load user profile on startup if token exists but user is null
  useEffect(() => {
    if (isAuthenticated && !user) {
      api.get('/auth/me')
        .then((res) => setUser(res.data.data))
        .catch(() => {});
    }
  }, [isAuthenticated, user, setUser]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/avatar-setup" element={<ProtectedRoute><AvatarSetup /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/mood/new" element={<ProtectedRoute><MoodLogger /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/friends/:id" element={<ProtectedRoute><FriendProfile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:friendId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><MonthlySummary /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
