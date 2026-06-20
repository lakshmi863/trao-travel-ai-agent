import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Changed this
import { apiRequest } from '../../utils/api'; // Fix path if needed

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Changed this

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      navigate('/dashboard'); // Changed this
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-2 !text-white">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8">Sign in to your travel vault</p>
        {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition">Login</button>
        </form>
        <p className="mt-6 text-center text-slate-400">New here? <Link to="/register" className="text-blue-500">Create account</Link></p>
      </div>
    </div>
  );
}