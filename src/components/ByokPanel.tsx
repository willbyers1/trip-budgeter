import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface ByokPanelProps {
  onSave: (key: string) => void;
  onCancel?: () => void;
  isInitial?: boolean;
}

export function ByokPanel({ onSave, onCancel, isInitial = false }: ByokPanelProps) {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 w-full flex flex-col relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-white/50" />
          API Configuration
        </h2>
        {!isInitial && onCancel && (
          <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
            ✕
          </button>
        )}
      </div>
      
      <p className="text-sm text-white/50 mb-8 leading-relaxed">
        To use AI-Trip-Budgeter, please provide your Google Gemini API key. 
        Your key is stored locally in your browser and never sent anywhere else.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">
            Gemini API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20 text-white"
            required
          />
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-4 rounded-2xl font-semibold tracking-wide transition-all"
          >
            Save Key
          </button>
          {!isInitial && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-transparent hover:bg-white/5 border border-white/5 text-white py-4 rounded-2xl font-semibold tracking-wide transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
