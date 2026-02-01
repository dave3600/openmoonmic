import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { Layout } from './components/shared/Layout';
import { Navigation } from './components/shared/Navigation';
import { SeedPhraseAuth } from './components/auth/SeedPhraseAuth';
import { UserDiscovery } from './components/discovery/UserDiscovery';
import { LiveSession } from './components/live/LiveSession';
import { Preferences } from './components/shared/Preferences';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  useFirebaseAuth();
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Navigation />
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/discover" replace /> : <SeedPhraseAuth />}
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <UserDiscovery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <LiveSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <div className="p-6 max-w-2xl mx-auto">
                  <Preferences />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? "/discover" : "/auth"} replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
