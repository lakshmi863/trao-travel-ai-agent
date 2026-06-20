import { CheckCircle2, CloudRain } from 'lucide-react';
import type { PackingItem } from '@/types';

interface PackingListProps {
  items: PackingItem[];
  destination: string;
}

export default function PackingList({ items, destination }: PackingListProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          Packing Checklist <span className="text-[10px] bg-indigo-500 text-white px-2 py-1 rounded-md uppercase tracking-tighter">Weather-Aware AI</span>
        </h3>
        <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
          <CloudRain size={14} className="text-indigo-400" /> Smart gear for {destination} climate
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items?.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:bg-slate-750 transition group cursor-pointer">
            <CheckCircle2 size={24} className={item.isPacked ? 'text-green-500' : 'text-slate-600 group-hover:text-slate-500'} />
            <div>
              <p className={`text-sm font-medium ${item.isPacked ? 'line-through text-slate-500' : 'text-white'}`}>
                {item.item}
              </p>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}