import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { LoadingScreen } from '../components/Skeleton';

const ROLE_COLORS = {
  owner: 'bg-[#6366f1]/20 text-[#818cf8] border-[#6366f1]/30',
  editor: 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30',
  viewer: 'bg-[#71717a]/20 text-[#a1a1aa] border-[#71717a]/30',
};

const TABS = ['Itinerary', 'Members', 'Budget', 'Checklist'];
const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Stay', 'Other'];

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

function getTripDays(startDate, endDate) {
  if (!startDate || !endDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  const d = new Date(start);
  while (d <= end) {
    days.push(d.getDate() - start.getDate() + 1);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function getProgressColor(pct) {
  if (pct <= 70) return '#22c55e';
  if (pct <= 90) return '#f59e0b';
  return '#ef4444';
}

export function TripDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Itinerary');
  const [activeDay, setActiveDay] = useState(1);

  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: '', time: '', location: '', description: '' });
  const [activitySubmitting, setActivitySubmitting] = useState(false);
  const [activityError, setActivityError] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const [expenses, setExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'Food', date: '' });
  const [expenseSubmitting, setExpenseSubmitting] = useState(false);
  const [expenseError, setExpenseError] = useState('');

  const [checklists, setChecklists] = useState([]);
  const [checklistsLoading, setChecklistsLoading] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState('');
  const [checklistSubmitting, setChecklistSubmitting] = useState(false);
  const [checklistError, setChecklistError] = useState('');

  async function fetchTrip() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/trips/${id}`);
      if (data.success && data.data) {
        setTrip(data.data);
        const days = getTripDays(data.data.startDate, data.data.endDate);
        if (days.length > 0 && activeDay > days.length) setActiveDay(days[0]);
      }
    } catch {
      setTrip(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrip();
  }, [id]);

  async function fetchActivities() {
    if (!id) return;
    setActivitiesLoading(true);
    try {
      const { data } = await api.get(`/api/activities/${id}/${activeDay}`);
      if (data.success && Array.isArray(data.data)) setActivities(data.data);
      else setActivities([]);
    } catch {
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'Itinerary' && trip) fetchActivities();
  }, [id, activeDay, activeTab, trip]);

  async function fetchExpenses() {
    if (!id) return;
    setExpensesLoading(true);
    try {
      const { data } = await api.get(`/api/expenses/trip/${id}`);
      if (data.success && Array.isArray(data.data)) setExpenses(data.data);
      else setExpenses([]);
    } catch {
      setExpenses([]);
    } finally {
      setExpensesLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'Budget') fetchExpenses();
  }, [id, activeTab]);

  async function fetchChecklists() {
    if (!id) return;
    setChecklistsLoading(true);
    try {
      const { data } = await api.get(`/api/checklists/trip/${id}`);
      if (data.success && Array.isArray(data.data)) setChecklists(data.data);
      else setChecklists([]);
    } catch {
      setChecklists([]);
    } finally {
      setChecklistsLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'Checklist') fetchChecklists();
  }, [id, activeTab]);

  async function handleAddActivity(e) {
    e.preventDefault();
    setActivityError('');
    setActivitySubmitting(true);
    try {
      const { data } = await api.post(`/api/activities/${id}/${activeDay}`, {
        title: activityForm.title.trim(),
        time: activityForm.time || undefined,
        location: activityForm.location?.trim() || undefined,
        description: activityForm.description?.trim() || undefined,
      });
      if (data.success) {
        setActivityFormOpen(false);
        setActivityForm({ title: '', time: '', location: '', description: '' });
        showToast('Activity added', 'success');
        await fetchActivities();
      } else {
        setActivityError(data.error || 'Failed to add activity');
        showToast(data.error || 'Failed to add activity', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setActivityError(msg);
      showToast(msg, 'error');
    } finally {
      setActivitySubmitting(false);
    }
  }

  async function handleDeleteActivity(activityId) {
    try {
      const { data } = await api.delete(`/api/activities/${activityId}`);
      if (data.success) {
        showToast('Activity removed', 'success');
        await fetchActivities();
      }
    } catch {
      showToast('Failed to remove activity', 'error');
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    setInviteError('');
    setInviteSubmitting(true);
    try {
      const { data } = await api.post(`/api/trips/${id}/invite`, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      if (data.success) {
        setInviteEmail('');
        setInviteRole('editor');
        showToast('Invitation sent', 'success');
        await fetchTrip();
      } else {
        setInviteError(data.error || 'Failed to invite');
        showToast(data.error || 'Failed to invite', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setInviteError(msg);
      showToast(msg, 'error');
    } finally {
      setInviteSubmitting(false);
    }
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setExpenseError('');
    setExpenseSubmitting(true);
    try {
      const { data } = await api.post('/api/expenses', {
        trip: id,
        title: expenseForm.title.trim(),
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        paidBy: user?.id,
        date: expenseForm.date || new Date().toISOString().slice(0, 10),
      });
      if (data.success) {
        setExpenseFormOpen(false);
        setExpenseForm({ title: '', amount: '', category: 'Food', date: '' });
        showToast('Expense added', 'success');
        await fetchExpenses();
      } else {
        setExpenseError(data.error || 'Failed to add expense');
        showToast(data.error || 'Failed to add expense', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setExpenseError(msg);
      showToast(msg, 'error');
    } finally {
      setExpenseSubmitting(false);
    }
  }

  async function handleAddChecklist(e) {
    e.preventDefault();
    setChecklistError('');
    setChecklistSubmitting(true);
    try {
      const { data } = await api.post('/api/checklists', {
        trip: id,
        title: checklistTitle.trim(),
        items: [{ text: checklistTitle.trim(), done: false }],
      });
      if (data.success) {
        setChecklistTitle('');
        showToast('Checklist item added', 'success');
        await fetchChecklists();
      } else {
        setChecklistError(data.error || 'Failed to add checklist');
        showToast(data.error || 'Failed to add checklist', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setChecklistError(msg);
      showToast(msg, 'error');
    } finally {
      setChecklistSubmitting(false);
    }
  }

  async function handleToggleChecklistItem(checklistId, itemId) {
    try {
      const { data } = await api.patch(`/api/checklists/${checklistId}/items/${itemId}/toggle`);
      if (data.success) await fetchChecklists();
    } catch {
      showToast('Failed to update', 'error');
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 p-8">
        <span className="text-[#71717a]">Trip not found.</span>
        <Link to="/dashboard" className="text-[#6366f1] hover:text-[#818cf8] transition-colors">Back to Dashboard</Link>
      </div>
    );
  }

  const days = getTripDays(trip.startDate, trip.endDate);
  const totalBudget = Number(trip.totalBudget) || 0;
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const spentPct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const members = trip.members || [];

  return (
    <div className="min-h-full">
      <div className="border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-10">
        <div className="px-8 py-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[#71717a] hover:text-[#f5f5f5] text-sm font-medium transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to trips
          </Link>
          <h1 className="text-2xl font-semibold text-[#f5f5f5] tracking-tight">{trip.title}</h1>
          <p className="text-[#71717a] text-sm mt-1 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {trip.destination || '—'}
            <span className="text-[#52525b]">·</span>
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
        </div>
        <div className="px-8 flex gap-6 border-t border-[#2a2a2a]">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-[#6366f1] text-[#f5f5f5]'
                  : 'border-transparent text-[#71717a] hover:text-[#f5f5f5]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        {activeTab === 'Itinerary' && (
          <div>
            {days.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <p className="text-[#71717a]">No dates set for this trip.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-2 scrollbar-hide">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setActiveDay(day)}
                      className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeDay === day
                          ? 'bg-[#6366f1] text-white'
                          : 'bg-[#1a1a1a] text-[#71717a] hover:text-[#f5f5f5] border border-[#2a2a2a]'
                      }`}
                    >
                      Day {day}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-[#f5f5f5]">Day {activeDay}</h2>
                  <button
                    type="button"
                    onClick={() => setActivityFormOpen(true)}
                    className="text-sm font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors"
                  >
                    + Add Activity
                  </button>
                </div>
                {activitiesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-[#1a1a1a] rounded-lg animate-pulse border-l-4 border-[#1a1a1a]" />
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="flex flex-col items-center py-12 border-2 border-dashed border-[#2a2a2a] rounded-xl">
                    <p className="text-[#71717a] text-sm mb-2">No activities for this day</p>
                    <button
                      type="button"
                      onClick={() => setActivityFormOpen(true)}
                      className="text-[#6366f1] hover:text-[#818cf8] text-sm font-medium"
                    >
                      Add your first activity
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((a) => (
                      <div
                        key={a._id}
                        className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-4 flex justify-between items-start gap-4 border-l-4 border-l-[#6366f1] hover:border-[#3a3a3a] transition-colors"
                      >
                        <div className="min-w-0">
                          <h3 className="font-medium text-[#f5f5f5]">{a.title}</h3>
                          {a.time && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-[#1a1a1a] text-[#71717a]">
                              {a.time}
                            </span>
                          )}
                          {a.location && <p className="text-[#71717a] text-sm mt-1">{a.location}</p>}
                          {a.description && <p className="text-[#71717a] text-sm mt-1">{a.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(a._id)}
                          className="text-[#71717a] hover:text-[#ef4444] text-sm shrink-0 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setActivityFormOpen(true)}
                      className="w-full py-4 border-2 border-dashed border-[#2a2a2a] rounded-lg text-[#71717a] hover:border-[#6366f1] hover:text-[#6366f1] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">+</span>
                      Add Activity
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'Members' && (
          <div>
            <div className="space-y-2 mb-6">
              {members.map((m) => (
                <div
                  key={m.user?._id || m.user}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg bg-[#111111] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1] font-medium shrink-0">
                    {(typeof m.user === 'object' && m.user ? (m.user.name || m.user.email || '?') : '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#f5f5f5]">
                      {typeof m.user === 'object' && m.user ? (m.user.name || m.user.email || '—') : '—'}
                    </p>
                    <p className="text-[#71717a] text-sm truncate">
                      {typeof m.user === 'object' && m.user ? m.user.email : '—'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border shrink-0 ${ROLE_COLORS[m.role] ?? ROLE_COLORS.viewer}`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleInvite} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <h3 className="text-[#f5f5f5] font-medium mb-4">Invite member</h3>
              {inviteError && (
                <p className="text-[#fca5a5] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2 mb-4">
                  {inviteError}
                </p>
              )}
              <div className="flex flex-wrap gap-3 items-end">
                <label className="flex-1 min-w-[200px]">
                  <span className="text-[#71717a] text-sm block mb-1.5">Email</span>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                    placeholder="friend@example.com"
                  />
                </label>
                <label>
                  <span className="text-[#71717a] text-sm block mb-1.5">Role</span>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </label>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {inviteSubmitting ? 'Inviting...' : 'Invite'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'Budget' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-[#71717a] text-sm">Total Budget</p>
                <p className="text-xl font-semibold text-[#f5f5f5] mt-1">₹{(totalBudget || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-[#71717a] text-sm">Total Spent</p>
                <p className="text-xl font-semibold text-[#f5f5f5] mt-1">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-[#71717a] text-sm">Remaining</p>
                <p className="text-xl font-semibold text-[#22c55e] mt-1">₹{remaining.toLocaleString()}</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${spentPct}%`,
                    backgroundColor: getProgressColor(spentPct),
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#f5f5f5]">Expenses</h2>
              <button
                type="button"
                onClick={() => setExpenseFormOpen(true)}
                className="text-sm font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors"
              >
                + Add Expense
              </button>
            </div>
            {expensesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-[#1a1a1a] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center py-12 border-2 border-dashed border-[#2a2a2a] rounded-xl">
                <p className="text-[#71717a] text-sm mb-2">No expenses yet</p>
                <button
                  type="button"
                  onClick={() => setExpenseFormOpen(true)}
                  className="text-[#6366f1] hover:text-[#818cf8] text-sm font-medium"
                >
                  Add your first expense
                </button>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                {expenses.map((e) => (
                  <div
                    key={e._id}
                    className="flex justify-between items-center px-4 py-3 border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-[#f5f5f5]">{e.title}</p>
                      <p className="text-[#71717a] text-sm">{e.category} · {formatDate(e.date)}</p>
                    </div>
                    <span className="font-medium text-[#f5f5f5]">₹{Number(e.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Checklist' && (
          <div>
            {checklistError && (
              <p className="text-[#fca5a5] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2 mb-4">
                {checklistError}
              </p>
            )}
            <form onSubmit={handleAddChecklist} className="flex gap-2 mb-6">
              <input
                type="text"
                value={checklistTitle}
                onChange={(e) => setChecklistTitle(e.target.value)}
                placeholder="Add new item..."
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
              />
              <button
                type="submit"
                disabled={checklistSubmitting || !checklistTitle.trim()}
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {checklistSubmitting ? 'Adding...' : 'Add'}
              </button>
            </form>
            {checklistsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-[#1a1a1a] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : checklists.length === 0 ? (
              <div className="flex flex-col items-center py-12 border-2 border-dashed border-[#2a2a2a] rounded-xl">
                <p className="text-[#71717a] text-sm mb-2">No checklist items yet</p>
                <p className="text-[#71717a] text-xs text-center max-w-sm">Add items above to track what you need to pack or prepare.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {checklists.map((c) => (
                  <div key={c._id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                    <h3 className="text-[#f5f5f5] font-medium mb-3">{c.title}</h3>
                    <ul className="space-y-2">
                      {(c.items || []).map((item) => (
                        <li key={item._id} className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleChecklistItem(c._id, item._id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-200 ${
                              item.done
                                ? 'bg-[#22c55e] border-[#22c55e] text-white'
                                : 'border-[#2a2a2a] hover:border-[#6366f1]'
                            }`}
                          >
                            {item.done && (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <span className={item.done ? 'text-[#71717a] line-through' : 'text-[#f5f5f5]'}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {activityFormOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4"
          onClick={() => !activitySubmitting && setActivityFormOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && !activitySubmitting && setActivityFormOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#111111] border border-[#2a2a2a] rounded-xl w-full max-w-md shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium text-[#f5f5f5] mb-4">Add Activity</h2>
            <form onSubmit={handleAddActivity} className="space-y-4">
              {activityError && (
                <p className="text-[#fca5a5] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2">
                  {activityError}
                </p>
              )}
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Title</span>
                <input
                  type="text"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Activity name"
                />
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Time</span>
                <input
                  type="time"
                  value={activityForm.time}
                  onChange={(e) => setActivityForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                />
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Location</span>
                <input
                  type="text"
                  value={activityForm.location}
                  onChange={(e) => setActivityForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Where"
                />
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Description</span>
                <textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] placeholder-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="Optional notes"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !activitySubmitting && setActivityFormOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#2a2a2a] text-[#71717a] hover:bg-[#1a1a1a] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={activitySubmitting}
                  className="flex-1 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {activitySubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {expenseFormOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4"
          onClick={() => !expenseSubmitting && setExpenseFormOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && !expenseSubmitting && setExpenseFormOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#111111] border border-[#2a2a2a] rounded-xl w-full max-w-md shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium text-[#f5f5f5] mb-4">Add Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              {expenseError && (
                <p className="text-[#fca5a5] text-sm bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2">
                  {expenseError}
                </p>
              )}
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Title</span>
                <input
                  type="text"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                  placeholder="What for"
                />
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                />
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Category</span>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[#71717a] text-sm block mb-1.5">Date</span>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, date: e.target.value }))}
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all duration-200"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !expenseSubmitting && setExpenseFormOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#2a2a2a] text-[#71717a] hover:bg-[#1a1a1a] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expenseSubmitting}
                  className="flex-1 py-2.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {expenseSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
