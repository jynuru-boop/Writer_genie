
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [userName, setUserName] = useState('');

  const handleStart = (name: string) => {
    setUserName(name);
    setHasStarted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {!hasStarted ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <ChatInterface userName={userName} />
        </div>
      )}
    </div>
  );
};

export default App;
