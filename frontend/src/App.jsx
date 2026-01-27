
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const TicketWizard = React.lazy(() => import('./components/TicketWizard'));

const LoadingScreen = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
    <Loader2 size={48} className="text-neon-green animate-spin" />
    <p className="text-white/50 text-sm font-mono animate-pulse">Chargement...</p>
  </div>
);

function App() {
  return (
    <div className="antialiased h-screen w-screen bg-black">
      <Suspense fallback={<LoadingScreen />}>
        <TicketWizard />
      </Suspense>
    </div>
  );
}

export default App;
