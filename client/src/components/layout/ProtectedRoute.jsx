import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
