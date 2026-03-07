import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { CardSkeleton } from '../components/Skeleton';

const ROLE_COLORS = {
  owner: 'bg-[#6366f1]/20 text-[#818cf8] border-[#6366f1]/30',
  editor: 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30',
  viewer: 'bg-[#71717a]/20 text-[#a1a1aa] border-[#71717a]/30',
};

const GRADIENT_MAP = [
  'from-indigo-600/80 to-purple-700/80',
  'from-emerald-600/80 to-teal-700/80',
  'from-amber-600/80 to-orange-700/80',
  'from-rose-600/80 to-pink-700/80',
  'from-cyan-600/80 to-blue-700/80',
];

function formatDate(str) {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return str;
  }
}

function getGradient(destination) {
  const hash = (destination || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENT_MAP[Math.abs(hash) % GRADIENT_MAP.length];
}

export function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [form, setForm] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
  });

  async function fetchTrips() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/trips');
      if (data.success && Array.isArray(data.data)) {
        setTrips(data.data);
      }
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  async function handleCreateTrip(e) {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const payload = {
        title: form.title.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        totalBudget: form.totalBudget ? Number(form.totalBudget) : undefined,
      };
      const { data } = await api.post('/api/trips', payload);
      if (data.success) {
        setModalOpen(false);
        setForm({ title: '', destination: '', startDate: '', endDate: '', totalBudget: '' });
        showToast('Trip created!', 'success');
        await fetchTrips();
      } else {
        setCreateError(data.error || 'Failed to create trip');
        showToast(data.error || 'Failed to create trip', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setCreateError(msg);
      showToast(msg, 'error');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#f5f5f5] tracking-tight">My Trips</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#71717a] text-sm font-medium">
            {trips.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
        >
          <span className="text-lg leading-none">+</span>
          New Trip
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111111] border border-[#2a2a2a] rounded-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 012-2h2.945M8 3V5a2 2 0 002 2h4a2 2 0 002-2V3M8 3V5a2 2 0 012-2h2.945M8 3H5a2 2 0 00-2 2v1a2 2 0 01-2 2H3" />
            </svg>
          </div>
          <p className="text-[#71717a] text-center mb-2">No trips yet</p>
          <p className="text-[#71717a] text-sm text-center mb-6 max-w-sm">Create your first trip to start planning with your travel buddies.</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
          >
            <span className="text-lg leading-none">+</span>
            New Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <Link
              key={trip._id}
              to={`/trip/${trip._id}`}
              className="group block rounded-xl border border-[#2a2a2a] bg-[#111111] overflow-hidden hover:border-[#3a3a3a] hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`h-24 bg-gradient-to-br ${getGradient(trip.destination)}`} />
              <div className="p-4">
                <h2 className="font-semibold text-[#f5f5f5] truncate group-hover:text-[#6366f1] transition-colors">{trip.title}</h2>
                <p className="text-[#71717a] text-sm mt-1 flex items-center gap-1.5 truncate">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {trip.destination || '—'}
                </p>
                <p className="text-[#71717a] text-xs mt-2">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#71717a] text-xs flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {trip.members?.length || 0} members
                  </span>
                  {trip.role && (
                    <span className={`text-xs px-2 py-0.5 rounded border ${ROLE_COLORS[trip.role] ?? ROLE_COLORS.viewer}`}>
                      {trip.role}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4"
          onClick={() => !creating && setModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && !creating && setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-trip-title"
        >
          <div
            className="bg-[#111111] border border-[#2a2a2a] rounded-xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="create-trip-title" className="text-lg font-medium text-[#f5f5f5] px-6 pt-6">
              Create trip
            </h2>
            <form onSubmit={handleCreateTrip} className="p-6 space-y-5">
              {createError && (
                <p className="text-[#fca5a5] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2">
                  {createError}
                </p>
              )}
              <label className="block">
                <span className="text-[#71717a] text-sm font-medium block mb-1.5">Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Trip name"
                />
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm font-medium block mb-1.5">Destination</span>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Where to?"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[#71717a] text-sm font-medium block mb-1.5">Start date</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  />
                </label>
                <label className="block">
                  <span className="text-[#71717a] text-sm font-medium block mb-1.5">End date</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[#71717a] text-sm font-medium block mb-1.5">Total budget</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.totalBudget}
                  onChange={(e) => setForm((f) => ({ ...f, totalBudget: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="0"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !creating && setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#2a2a2a] text-[#71717a] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6366f1]"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
