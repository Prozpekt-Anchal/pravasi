import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../hooks/useToast';

export function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      if (data.success) {
        showToast('Account created! Sign in to continue.', 'success');
        navigate('/login', { replace: true });
      } else {
        const err = data.error || 'Registration failed';
        setError(err);
        showToast(err, 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-semibold text-[#f5f5f5] tracking-tight">Pravasi</h1>
          </Link>
          <p className="text-[#71717a] text-sm mt-1">Plan together. Travel better.</p>
        </div>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-8 shadow-xl">
          <h2 className="text-lg font-medium text-[#f5f5f5] mb-6">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-[#fca5a5] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <label className="block">
              <span className="text-[#71717a] text-sm font-medium block mb-1.5">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-[#71717a] text-sm font-medium block mb-1.5">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="text-[#71717a] text-sm font-medium block mb-1.5">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6366f1]"
            >
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-[#71717a] text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6366f1] hover:text-[#818cf8] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
