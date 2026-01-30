import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth, ProtectedRoute } from './dashboard/context/AuthContext';

// Lazy load components
const TicketWizard = React.lazy(() => import('./components/TicketWizard'));
const LoginPage = React.lazy(() => import('./dashboard/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardLayout = React.lazy(() => import('./dashboard/pages/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const OverviewPage = React.lazy(() => import('./dashboard/pages/OverviewPage').then(m => ({ default: m.OverviewPage })));

const LoadingScreen = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
    <Loader2 size={48} className="text-neon-green animate-spin" />
    <p className="text-white/50 text-sm font-mono animate-pulse">Chargement...</p>
  </div>
);

// Wrapper for login page that redirects if already authenticated
const LoginRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginPage />
    </Suspense>
  );
};

// Placeholder pages
const AnalyticsPage = React.lazy(() => import('./dashboard/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const MapPage = React.lazy(() => import('./dashboard/pages/MapPage').then(m => ({ default: m.MapPage })));
const TicketsPage = React.lazy(() => import('./dashboard/pages/TicketsPage').then(m => ({ default: m.TicketsPage })));
const SettingsPage = React.lazy(() => import('./dashboard/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="antialiased h-screen w-screen bg-black">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <div className="h-full">
                    <TicketWizard />
                  </div>
                }
              />
              <Route path="/login" element={<LoginRoute />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OverviewPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
