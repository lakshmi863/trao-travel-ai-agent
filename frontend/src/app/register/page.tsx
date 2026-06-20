import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Create Account</h1>
        {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-slate-400">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
      </div>
    </div>
  );
}