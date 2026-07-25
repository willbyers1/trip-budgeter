import React from 'react';
import { BudgetEstimate } from '../types/budget';
import SpecularButton from './SpecularButton/SpecularButton';
import { MapPin, Calendar, DollarSign, Info, RotateCcw } from 'lucide-react';

interface BudgetResultProps {
  data: BudgetEstimate;
  onReset: () => void;
}

export function BudgetResult({ data, onReset }: BudgetResultProps) {
  // Safe parsing of numbers
  const dailyTotal = typeof data.dailyAverage === 'number' ? data.dailyAverage : 0;
  const grandTotal = typeof data.totalEstimated === 'number' ? data.totalEstimated : 0;

  const getCategoryColor = (idx: number) => {
    const colors = ['bg-blue-400', 'bg-orange-400', 'bg-purple-400', 'bg-green-400', 'bg-pink-400'];
    return colors[idx % colors.length];
  };
  
  const getCategoryShadow = (idx: number) => {
    const shadows = [
      'shadow-[0_0_12px_rgba(96,165,250,0.4)]',
      'shadow-[0_0_12px_rgba(251,146,60,0.4)]',
      'shadow-[0_0_12px_rgba(192,132,252,0.4)]',
      'shadow-[0_0_12px_rgba(74,222,128,0.4)]',
      'shadow-[0_0_12px_rgba(244,114,182,0.4)]'
    ];
    return shadows[idx % shadows.length];
  }

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 h-full flex flex-col overflow-y-auto lg:overflow-hidden">
      
      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-8 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 uppercase tracking-[0.3em] text-[10px] font-bold text-white/40">
            <span>Projection for</span>
            <span className="w-4 h-[1px] bg-white/20"></span>
            <span className="text-white/80 truncate max-w-[200px] sm:max-w-xs">{data.destination}</span>
          </div>
          <div className="text-5xl sm:text-6xl font-light tracking-tighter">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD', maximumFractionDigits: 0 }).format(grandTotal)}
            <span className="text-xl text-white/40 ml-2 tracking-normal">{data.currency || 'USD'}</span>
          </div>
        </div>
        <div className="sm:text-right pb-1">
          <p className="text-sm text-white/40">Daily average</p>
          <p className="text-2xl font-medium">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD', maximumFractionDigits: 0 }).format(dailyTotal)}
          </p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 lg:overflow-y-auto pr-2">
        {data.categories && data.categories.map((cat, idx) => {
          const amount = typeof cat.dailyAmount === 'number' ? cat.dailyAmount : 0;
          const pct = typeof cat.percentage === 'number' ? cat.percentage : 0;
          
          return (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-white/70">{cat.name}</span>
                <span className="text-white/40">{pct}% ({new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency || 'USD', maximumFractionDigits: 0 }).format(amount)})</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getCategoryColor(idx)} ${getCategoryShadow(idx)}`}
                  style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        
        {/* AI Notes */}
        {data.notes && (
          <div className="col-span-1 sm:col-span-2 mt-6 p-6 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="flex items-start gap-4 relative z-10">
              <div className="mt-1 w-5 h-5 flex-shrink-0 opacity-40">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-white/30">Travel Insight</h4>
                <p className="text-sm text-white/70 leading-relaxed italic">"{data.notes}"</p>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 blur-[40px] rounded-full"></div>
          </div>
        )}
      </div>

      {/* Reset Action */}
      <div className="mt-8 flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="text-xs uppercase tracking-widest font-bold text-white/30 hover:text-white/80 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Start Over
        </button>
      </div>
    </div>
  );
}
