import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Landing } from '../pages/Landing';

export function LandingOrRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}
