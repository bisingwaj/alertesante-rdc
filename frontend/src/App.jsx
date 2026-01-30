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
const AnalyticsPage = () => (
  <div className="p-8">
    <h2 className="text-3xl font-black text-white mb-2">Analytics</h2>
    <p className="text-white/60">Page en construction...</p>
  </div>
);

const MapPage = () => (
  <div className="p-8">
    <h2 className="text-3xl font-black text-white mb-2">Carte Géographique</h2>
    <p className="text-white/60">Page en construction...</p>
  </div>
);

const TicketsPage = () => (
  <div className="p-8">
    <h2 className="text-3xl font-black text-white mb-2">Signalements</h2>
    <p className="text-white/60">Page en construction...</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-8">
    <h2 className="text-3xl font-black text-white mb-2">Paramètres</h2>
    <p className="text-white/60">Page en construction...</p>
  </div>
);

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
