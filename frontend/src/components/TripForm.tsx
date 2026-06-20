import { Plane, Loader2 } from 'lucide-react';

interface TripFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function TripForm({ onSubmit, loading }: TripFormProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
        <Plane size={20} className="text-blue-500 !text-white" /> Plan New Adventure
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Destination</label>
          <input name="destination" placeholder="Tokyo, Japan" required className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-2 ring-blue-500 transition border border-transparent" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Days</label>
            <input name="days" type="number" min="1" max="14" placeholder="5" required className="w-full p-3 bg-slate-800 rounded-xl outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Budget</label>
            <select name="budget" className="w-full p-3 bg-slate-800 rounded-xl outline-none appearance-none">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Interests</label>
          <input name="interests" placeholder="Food, Anime, Temples" className="w-full p-3 bg-slate-800 rounded-xl outline-none" />
        </div>

        <button disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2 mt-2">
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Generate AI Trip"}
        </button>
      </form>
    </div>
  );
}