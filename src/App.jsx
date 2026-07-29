import React, { useState } from 'react';
import DashboardScreen from './components/DashboardScreen';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-4 sm:py-8">
      {/* Mobile container frame */}
      <div className="w-full max-w-md bg-brand-teal min-h-[100dvh] sm:min-h-[850px] sm:h-[850px] sm:rounded-[3rem] sm:shadow-2xl overflow-hidden relative border-0 sm:border-[8px] border-gray-900 flex flex-col">
        {hasStarted ? (
          <DashboardScreen />
        ) : (
          <WelcomeScreen onBegin={() => setHasStarted(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
