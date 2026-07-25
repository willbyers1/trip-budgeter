import React, { useState } from 'react';
import SpecularButton from './SpecularButton/SpecularButton';

interface TripFormProps {
  onSubmit: (destination: string, days: number) => void;
  isLoading: boolean;
  error?: string;
}

export function TripForm({ onSubmit, isLoading, error: globalError }: TripFormProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number | ''>(7);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destination.trim()) {
      setError('Please enter a destination.');
      return;
    }

    const parsedDays = Number(days);
    if (!days || isNaN(parsedDays) || parsedDays <= 0 || parsedDays > 90) {
      setError('Please enter a valid number of days (1-90).');
      return;
    }

    onSubmit(destination.trim(), parsedDays);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">Plan your <span className="font-bold">escape</span>.</h1>
        <p className="text-sm text-white/50">Enter your destination to get an AI-powered budget estimation.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-6">
        <div className="space-y-2">
          <label htmlFor="destination" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Kyoto, Japan"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20 text-white"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="days" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
            Duration (Days)
          </label>
          <div className="relative">
            <input
              id="days"
              type="number"
              min="1"
              max="90"
              value={days}
              onChange={(e) => setDays(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="7"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-white/30 transition-all text-white"
              disabled={isLoading}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 text-xs pointer-events-none">Days</span>
          </div>
        </div>

        {(error || globalError) && (
          <div className="text-red-300 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {error || globalError}
          </div>
        )}

        <div className="mt-auto pt-8">
          <SpecularButton
            type="submit"
            disabled={isLoading}
            onClick={() => {}}
            size="lg"
            intensity={1.2}
            shineSize={15}
            tint="#1a1b1e"
            tintOpacity={0.8}
            textColor={isLoading ? '#a3a3a3' : '#ffffff'}
            baseColor="#1a1b1e"
            lineColor="#ffffff"
            className="w-full !rounded-2xl"
          >
            {isLoading ? 'Estimating...' : 'Estimate Budget'}
          </SpecularButton>
        </div>
      </form>
    </div>
  );
}
