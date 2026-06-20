import { RefreshCw, Clock } from 'lucide-react';
import type { ItineraryDay } from '@/types';

interface ItineraryCardProps {
  day: ItineraryDay;
  onRegenerate: (dayNumber: number) => void;
}

export default function ItineraryCard({ day, onRegenerate }: ItineraryCardProps) {
  return (
    <div className="relative pl-10 border-l-2 border-slate-800 pb-10 last:pb-0">
      <div className="absolute -left-[11px] top-0 w-5 h-5 bg-blue-600 rounded-full border-4 border-slate-950 ring-2 ring-blue-900/30" />
      
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-bold text-white">Day {day.dayNumber}</h4>
        <button 
          onClick={() => onRegenerate(day.dayNumber)}
          className="text-xs text-blue-400 hover:text-white flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full transition"
        >
          <RefreshCw size={12} /> Customize
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {day.activities.map((act, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl group hover:border-blue-500/50 transition shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-bold text-white group-hover:text-blue-400 transition">{act.title}</h5>
              <div className="flex items-center gap-1 text-[10px] bg-slate-900 text-blue-300 border border-slate-700 px-2 py-0.5 rounded-md font-bold uppercase">
                <Clock size={10} /> {act.timeOfDay}
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{act.description}</p>
            {act.estimatedCostUSD > 0 && (
              <p className="text-xs text-green-500 mt-3 font-semibold tracking-wide">
                EST. COST: ${act.estimatedCostUSD}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}