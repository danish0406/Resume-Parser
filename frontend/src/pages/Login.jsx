import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C10] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-[#253746] bg-[#172330] shadow-premium">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF763D] to-[#FFA37A] bg-clip-text text-transparent mb-2">
            ResumeIntel
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            AI Talent Acquisition Suite
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recruiter@example.com"
              className="w-full bg-[#080C10] border border-[#253746] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#080C10] border border-[#253746] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !email || !password}
            className="w-full mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 font-medium">
          Try logging in with <code className="text-gray-300 font-bold bg-white/5 px-1.5 py-0.5 rounded border border-[#253746]">recruiter@example.com</code> / <code className="text-gray-300 font-bold bg-white/5 px-1.5 py-0.5 rounded border border-[#253746]">password123</code>
        </div>
      </Card>
    </div>
  );
};
export default Login;
