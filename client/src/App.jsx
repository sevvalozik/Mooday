import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
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
import { useSocket } from './hooks/useSocket.js';

export default function App() {
  useSocket();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/mood/new" element={<ProtectedRoute><MoodLogger /></ProtectedRoute>} />
      <Route path="/friends/:id" element={<ProtectedRoute><FriendProfile /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/messages/:friendId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
      <Route path="/summary" element={<ProtectedRoute><MonthlySummary /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    </Routes>
  );
}
