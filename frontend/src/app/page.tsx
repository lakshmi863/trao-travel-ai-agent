import { Link } from 'react-router-dom';
import { Sparkles, Map, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-blue-600 p-4 rounded-2xl mb-6">
        <img src="/trao-logo.jpg" alt="Trao Logo" className="w-20 h-20 rounded-2xl mb-6" />
      </div>
      <h1 className="text-6xl font-black tracking-tighter mb-4 !text-white">TRAO <span className="text-blue-500">AI</span></h1>
      <p className="text-slate-400 text-lg text-center max-w-md mb-12">
        AI-powered travel planning. Generate personalized itineraries in seconds.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <Sparkles className="text-blue-500 mb-3" />
          <h3 className="font-bold mb-1">AI Generated</h3>
          <p className="text-slate-400 text-sm">Personalized itineraries powered by Gemini AI</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <Map className="text-green-500 mb-3" />
          <h3 className="font-bold mb-1">Day-by-Day Plans</h3>
          <p className="text-slate-400 text-sm">Detailed schedules with cost estimates</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <ShieldCheck className="text-purple-500 mb-3" />
          <h3 className="font-bold mb-1">Secure Vault</h3>
          <p className="text-slate-400 text-sm">All your trips saved and protected</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition">
          Get Started
        </Link>
        <Link to="/login" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition">
          Login
        </Link>
      </div>
    </div>
  );
}