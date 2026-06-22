import { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Plus, MapPin, Wallet, Calendar, Trash2, Loader2, LogOut,
  CheckCircle2, RefreshCw, Hotel, SlidersHorizontal
} from 'lucide-react';
import HotelCard from '../../components/HotelCard';

export default function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshingHotels, setRefreshingHotels] = useState(false);
  const [hotelFilter, setHotelFilter] = useState<string>('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      const data = await apiRequest('/api/trips');
      setTrips(data);
      if (data.length > 0) setSelectedTrip(data[0]);
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTrip(e: any) {
    e.preventDefault();
    setGenerating(true);
    const formData = new FormData(e.target);
    const payload = {
      destination: formData.get('destination'),
      durationDays: Number(formData.get('days')),
      budgetTier: formData.get('budget'),
      interests: (formData.get('interests') as string).split(',').map(i => i.trim()),
    };

    try {
      const newTrip = await apiRequest('/api/trips', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setTrips([newTrip, ...trips]);
      setSelectedTrip(newTrip);
      setHotelFilter('All');
      e.target.reset();
    } catch (err) {
      alert("AI Generation Error. Check Console.");
    } finally {
      setGenerating(false);
    }
  }

  async function deleteTrip(id: string) {
    if (!confirm("Delete this itinerary?")) return;
    try {
      await apiRequest(`/api/trips/${id}`, { method: 'DELETE' });
      const filtered = trips.filter(t => t._id !== id);
      setTrips(filtered);
      setSelectedTrip(filtered[0] || null);
    } catch (err) { console.error(err); }
  }

  async function regenerateDay(dayNumber: number) {
    if (!selectedTrip) return;
    try {
      const feedback = prompt("What would you like to change about this day?");
      const updatedTrip = await apiRequest(`/api/trips/${selectedTrip._id}/regen-day`, {
        method: 'PUT',
        body: JSON.stringify({ dayNumber, feedback })
      });
      setSelectedTrip(updatedTrip);
      setTrips(trips.map(t => t._id === updatedTrip._id ? updatedTrip : t));
    } catch (err) { alert("Failed to regenerate day"); }
  }

  // ─── Refresh Hotel Suggestions ──────────────────────────────────────────────
  async function handleRefreshHotels() {
    if (!selectedTrip) return;
    setRefreshingHotels(true);
    try {
      const result = await apiRequest(`/api/trips/${selectedTrip._id}/suggest-hotels`, {
        method: 'PUT',
      });
      const updatedTrip = { ...selectedTrip, hotels: result.hotels };
      setSelectedTrip(updatedTrip);
      setTrips(trips.map(t => t._id === updatedTrip._id ? updatedTrip : t));
      setHotelFilter('All');
    } catch (err) {
      alert("Failed to refresh hotel suggestions.");
    } finally {
      setRefreshingHotels(false);
    }
  }

  // ─── Filtered Hotels ─────────────────────────────────────────────────────────
  const FILTER_OPTIONS = ['All', 'Top Pick', 'Budget', 'Mid-Range', 'Luxury'];

  const filteredHotels = (selectedTrip?.hotels ?? []).filter((h: any) =>
    hotelFilter === 'All' ? true : h.tier === hotelFilter
  );

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="animate-pulse">Accessing Secure Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/trao-logo.jpg" alt="Trao Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-black tracking-tighter !text-white">Trao <span className="text-blue-500">AI</span></h1>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Form & History */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 !text-white">
              <Plus size={20} className="text-blue-500" /> Plan Adventure
            </h2>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Destination</label>
                <input name="destination" placeholder="Paris, France" required className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-2 ring-blue-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Days</label>
                  <input name="days" type="number" min="1" max="10" placeholder="3" required className="w-full p-3 bg-slate-800 rounded-xl outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Budget</label>
                  <select name="budget" className="w-full p-3 bg-slate-800 rounded-xl outline-none appearance-none">
                    <option value="Low">Economic</option>
                    <option value="Medium">Standard</option>
                    <option value="High">Luxury</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Interests</label>
                <input name="interests" placeholder="Museums, Food, Art" className="w-full p-3 bg-slate-800 rounded-xl outline-none" />
              </div>
              <button disabled={generating} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                {generating ? <Loader2 className="animate-spin" size={20} /> : "Generate Plan"}
              </button>
            </form>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold mb-4 !text-white">Your Itineraries</h2>
            <div className="space-y-3">
              {trips.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No trips yet.</p>}
              {trips.map(t => (
                <div key={t._id} className="group relative">
                  <button onClick={() => { setSelectedTrip(t); setHotelFilter('All'); }} className={`w-full p-4 rounded-2xl text-left border transition ${selectedTrip?._id === t._id ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}>
                    <p className="font-bold !text-white leading-tight">{t.destination}</p>
                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wider">{t.durationDays} Days • {t.budgetTier}</p>
                  </button>
                  <button onClick={() => deleteTrip(t._id)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Itinerary Detail */}
        <div className="lg:col-span-8">
          {selectedTrip ? (
            <div className="space-y-6">

              {/* Trip Overview Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><MapPin size={120} /></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h2 className="text-5xl font-black !text-white tracking-tight">{selectedTrip.destination}</h2>
                    <div className="flex flex-wrap gap-4 mt-4 text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                        <Calendar size={16} className="text-blue-500" /> {selectedTrip.durationDays} Days
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                        <Wallet size={16} className="text-green-500" /> {selectedTrip.budgetTier} Budget
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Estimated</p>
                    <p className="text-3xl font-black text-green-400">${selectedTrip.estimatedBudget.total}</p>
                  </div>
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-white">Daily Itinerary</h3>
                </div>
                <div className="space-y-12">
                  {selectedTrip.itinerary.map((day: any) => (
                    <div key={day.dayNumber} className="relative pl-10 border-l-2 border-slate-800">
                      <div className="absolute -left-[11px] top-0 w-5 h-5 bg-blue-600 rounded-full border-4 border-slate-950 ring-2 ring-blue-900/30" />
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-white">Day {day.dayNumber}</h4>
                        <button onClick={() => regenerateDay(day.dayNumber)} className="text-xs text-blue-400 hover:text-white flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full transition">
                          <RefreshCw size={12} /> Customize
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {day.activities.map((act: any, i: number) => (
                          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl group hover:border-blue-500/50 transition">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-white group-hover:text-blue-400 transition">{act.title}</h5>
                              <span className="text-[10px] bg-slate-900 text-blue-300 border border-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                                {act.timeOfDay}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{act.description}</p>
                            {act.estimatedCostUSD > 0 && (
                              <p className="text-xs text-slate-500 mt-3 font-medium">Est. Cost: ${act.estimatedCostUSD}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Hotel Suggestions ─────────────────────────────────────────── */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Hotel size={22} className="text-blue-400" />
                      Hotel Suggestions
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-md uppercase tracking-tighter font-bold">AI Curated</span>
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Rated picks for {selectedTrip.destination} · {selectedTrip.budgetTier} budget
                    </p>
                  </div>
                  <button
                    onClick={handleRefreshHotels}
                    disabled={refreshingHotels}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {refreshingHotels
                      ? <><Loader2 className="animate-spin" size={15} /> Refreshing…</>
                      : <><SlidersHorizontal size={15} /> Refresh Picks</>
                    }
                  </button>
                </div>

                {/* Filter Tabs */}
                {selectedTrip.hotels?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {FILTER_OPTIONS.map(f => (
                      <button
                        key={f}
                        onClick={() => setHotelFilter(f)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                          hotelFilter === f
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}

                {/* Hotel Cards Grid */}
                {selectedTrip.hotels?.length > 0 ? (
                  filteredHotels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredHotels.map((hotel: any, i: number) => (
                        <HotelCard key={i} hotel={hotel} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      <Hotel size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No hotels match this filter.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    <Hotel size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm mb-3">No hotel suggestions yet.</p>
                    <button
                      onClick={handleRefreshHotels}
                      disabled={refreshingHotels}
                      className="text-sm font-bold text-blue-400 hover:text-white bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/30 transition disabled:opacity-50"
                    >
                      {refreshingHotels ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null}
                      Generate Hotel Picks
                    </button>
                  </div>
                )}
              </div>

              {/* Weather-Aware Packing Assistant */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    Packing Checklist <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-md">Weather-Aware AI</span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Smart items for {selectedTrip.destination}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTrip.packingList?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:bg-slate-750 cursor-default transition">
                      <CheckCircle2 size={24} className={item.isPacked ? 'text-green-500' : 'text-slate-600'} />
                      <div>
                        <p className={`text-sm font-medium ${item.isPacked ? 'line-through text-slate-500' : 'text-white'}`}>{item.item}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
              <div className="bg-slate-800 p-6 rounded-full mb-6 text-slate-700"><Plane size={60} /></div>
              <h2 className="text-2xl font-bold text-slate-500">No Trip Selected</h2>
              <p className="mt-2 text-sm text-center max-w-xs">Fill out the form or select a saved itinerary to start planning with Trao AI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
