import React, { useState, useEffect } from 'react';
import Aurora from './components/Aurora/Aurora';
import { TripForm } from './components/TripForm';
import { BudgetResult } from './components/BudgetResult';
import { ByokPanel } from './components/ByokPanel';
import { getBudgetEstimate } from './services/geminiClient';
import { BudgetEstimate } from './types/budget';

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BudgetEstimate | null>(null);
  const [globalError, setGlobalError] = useState('');

  // Load API key on mount
  useEffect(() => {
    const stored = localStorage.getItem('GEMINI_API_KEY') || (import.meta as any).env.VITE_GEMINI_API_KEY;
    if (stored) {
      setApiKey(stored);
      setShowConfig(false);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
    setShowConfig(false);
    setGlobalError('');
  };

  const handleSubmit = async (destination: string, days: number) => {
    if (!apiKey) {
      setShowConfig(true);
      return;
    }

    setIsLoading(true);
    setGlobalError('');
    setResult(null);

    try {
      const data = await getBudgetEstimate(destination, days, apiKey);
      setResult(data);
    } catch (err: any) {
      setGlobalError(err.message || 'Something went wrong. Please try again.');
      // If it looks like an auth error, maybe prompt for key again
      if (err.message?.toLowerCase().includes('api key')) {
        setShowConfig(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setGlobalError('');
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden bg-[#0a0a0f] flex flex-col">
      {/* Background Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Aurora 
          colorStops={['#5227FF', '#7cff67', '#FF3232']} 
          blend={0.5} 
          amplitude={1.2} 
          speed={0.4} 
        />
      </div>

      {/* Top Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-xs font-bold tracking-tighter">AI</span>
          </div>
          <span className="text-xl font-medium tracking-tight">TripBudgeter</span>
        </div>
        <div className="flex items-center gap-6">
          {apiKey && (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
              <span className="text-[11px] uppercase tracking-widest text-white/60 font-semibold">Gemini Connected</span>
            </div>
          )}
          {!showConfig && (
            <button 
              onClick={() => setShowConfig(true)}
              className="text-xs uppercase tracking-widest font-semibold hover:text-white/80 transition-colors"
            >
              Settings
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-10 pb-10 overflow-y-auto lg:overflow-hidden">
        
        {showConfig ? (
          <div className="lg:col-span-12 flex items-center justify-center h-full">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ByokPanel 
                onSave={handleSaveKey} 
                onCancel={apiKey ? () => setShowConfig(false) : undefined}
                isInitial={!apiKey}
              />
            </div>
          </div>
        ) : (
          <>
            <div className={`flex flex-col h-full transition-all duration-500 ${result ? 'lg:col-span-4' : 'lg:col-span-6 lg:col-start-4'}`}>
              <TripForm onSubmit={handleSubmit} isLoading={isLoading} error={globalError} />
            </div>

            {result && (
              <div className="lg:col-span-8 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <BudgetResult data={result} onReset={handleReset} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Details */}
      <footer className="relative z-20 px-6 sm:px-10 py-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-widest gap-2">
        <span>Powered by Gemini 1.5 Pro</span>
        <div className="flex gap-4 italic text-center sm:text-left">
          <span>Updated Oct 2023</span>
          <span className="hidden sm:inline">Estimates include 10% safety buffer</span>
        </div>
      </footer>
    </div>
  );
}
