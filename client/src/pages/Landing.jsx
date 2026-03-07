import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Smart Itinerary Builder',
    description: 'Plan day-by-day activities with times and locations. Drag to reorder, add notes, and never miss a beat.',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Real-time Collaboration',
    description: 'Invite friends with editor or viewer roles. Everyone stays in sync — no more scattered spreadsheets.',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Budget Tracker',
    description: 'Track expenses by category and see who spent what. Split costs fairly and avoid awkward conversations.',
    color: 'bg-amber-500/10 text-amber-500',
  },
];

const STEPS = [
  { num: 1, title: 'Create a trip', description: 'Set your destination, dates and budget in seconds.', icon: '✈️' },
  { num: 2, title: 'Invite your crew', description: 'Share access with friends and family via email.', icon: '👥' },
  { num: 3, title: 'Plan together', description: 'Add activities, track expenses, check off packing lists.', icon: '📋' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', trip: 'Bali', quote: 'We used Pravasi for our girls\' trip and it was a game-changer. Everyone could add their must-do activities and we split expenses without any hassle.', initial: 'P', color: 'from-violet-500 to-purple-600' },
  { name: 'Arjun Mehta', trip: 'Kerala', quote: 'Finally, a tool that actually works for group travel. The budget tracker saved us so many awkward conversations about who paid for what.', initial: 'A', color: 'from-indigo-500 to-blue-600' },
  { name: 'Sneha Patel', trip: 'Euro trip', quote: 'The itinerary builder is so intuitive. We had 6 people planning 12 days across 4 cities — Pravasi kept us all on the same page.', initial: 'S', color: 'from-emerald-500 to-teal-600' },
];

const STATS = [
  { value: '10,000+', label: 'Trips Planned' },
  { value: '50,000+', label: 'Activities Added' },
  { value: '99.9%', label: 'Uptime' },
];

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-text)]"
    >
      {children}
    </a>
  );
}

export function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen landing-bg theme-transition" style={{ color: 'var(--landing-text)' }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 w-full border-b theme-transition"
        style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" style={{ color: 'var(--landing-text)' }}>
            <span className="text-2xl">✈️</span>
            Pravasi
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 transition-colors hover:bg-[var(--landing-surface)]"
              style={{ color: 'var(--landing-muted)' }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--landing-surface)] sm:inline-block"
              style={{ color: 'var(--landing-muted)' }}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 sm:inline-block"
              style={{ backgroundColor: 'var(--landing-accent)' }}
            >
              Get started
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 md:hidden"
              style={{ color: 'var(--landing-text)' }}
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="border-t px-4 py-4 md:hidden theme-transition"
            style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium" style={{ color: 'var(--landing-text)' }} onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-sm font-medium" style={{ color: 'var(--landing-text)' }} onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#testimonials" className="text-sm font-medium" style={{ color: 'var(--landing-text)' }} onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 rounded-lg border py-2.5 text-center text-sm font-medium theme-transition" style={{ borderColor: 'var(--landing-border)', color: 'var(--landing-text)' }} onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="flex-1 rounded-lg py-2.5 text-center text-sm font-medium text-white theme-transition" style={{ backgroundColor: 'var(--landing-accent)' }} onClick={() => setMobileMenuOpen(false)}>Get started</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--landing-accent) 1px, transparent 1px),
                             linear-gradient(90deg, var(--landing-accent) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium theme-transition"
            style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)', color: 'var(--landing-muted)' }}
          >
            <span className="animate-pulse">✨</span>
            Collaborative trip planning, reimagined
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block" style={{ color: 'var(--landing-text)' }}>Plan together.</span>
            <span className="mt-2 block bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Travel better.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: 'var(--landing-muted)' }}>
            The collaborative trip planner for groups who want to go further. Build itineraries, split budgets, and stay in sync — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg px-6 py-3.5 text-base font-medium text-white transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--landing-accent)' }}
            >
              Start planning for free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border px-6 py-3.5 text-base font-medium transition-colors hover:bg-[var(--landing-surface)]"
              style={{ borderColor: 'var(--landing-border)', color: 'var(--landing-text)' }}
            >
              See how it works
            </a>
          </div>

          {/* Floating mockup cards */}
          <div className="relative mt-20 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div
              className="w-[280px] rounded-xl border p-4 shadow-xl theme-transition"
              style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
            >
              <div className="h-2 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
              <p className="mt-3 font-semibold" style={{ color: 'var(--landing-text)' }}>Bali — Girls Trip</p>
              <p className="text-xs" style={{ color: 'var(--landing-muted)' }}>12–22 Dec · 4 members</p>
            </div>
            <div
              className="w-[260px] rounded-xl border p-4 shadow-xl theme-transition"
              style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'var(--landing-muted)' }}>Day 2 · 10:00</p>
              <p className="mt-1 font-medium" style={{ color: 'var(--landing-text)' }}>Ubud Monkey Forest</p>
              <p className="text-xs" style={{ color: 'var(--landing-muted)' }}>Ubud, Bali</p>
            </div>
            <div
              className="w-[240px] rounded-xl border p-4 shadow-xl theme-transition"
              style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
            >
              <p className="text-xs" style={{ color: 'var(--landing-muted)' }}>Budget</p>
              <p className="mt-1 font-semibold" style={{ color: 'var(--landing-text)' }}>₹45,200 / ₹60,000</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--landing-border)' }}>
                <div className="h-full w-3/4 rounded-full bg-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="border-y py-8 theme-transition"
        style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6">
              {i > 0 && <div className="hidden h-8 w-px sm:block" style={{ backgroundColor: 'var(--landing-border)' }} />}
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold" style={{ color: 'var(--landing-text)' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: 'var(--landing-muted)' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Everything you need to plan as a team
            </span>
          </h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border p-6 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
                style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}
              >
                <div className={`inline-flex rounded-xl p-3 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--landing-text)' }}>{f.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--landing-muted)' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t px-4 py-20 theme-transition sm:px-6 sm:py-28" style={{ borderColor: 'var(--landing-border)' }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl" style={{ color: 'var(--landing-text)' }}>
            How it works
          </h2>
          <div className="relative mt-16 grid gap-12 sm:grid-cols-3">
            <div className="absolute left-[16.666%] right-[16.666%] top-7 hidden h-0.5 sm:block" style={{ backgroundColor: 'var(--landing-border)' }} />
            {STEPS.map((s) => (
              <div key={s.num} className="relative z-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white" style={{ backgroundColor: 'var(--landing-accent)' }}>
                  {s.icon}
                </div>
                <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--landing-accent)' }}>Step {s.num}</p>
                <h3 className="mt-1 text-lg font-semibold" style={{ color: 'var(--landing-text)' }}>{s.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--landing-muted)' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl" style={{ color: 'var(--landing-text)' }}>
            Loved by travelers
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-6 theme-transition ${i === 1 ? 'lg:mt-8' : ''}`}
                style={{
                  borderColor: 'var(--landing-border)',
                  backgroundColor: 'var(--landing-surface)',
                }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-[var(--landing-text)]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-semibold text-white`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--landing-text)' }}>{t.name}</p>
                    <p className="text-sm" style={{ color: 'var(--landing-muted)' }}>Trip to {t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 sm:py-28">
        <div
          className="mx-auto max-w-4xl rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20"
          style={{
            background: 'linear-gradient(135deg, var(--landing-accent) 0%, #7c3aed 50%, var(--landing-accent) 100%)',
          }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to plan your next adventure?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join thousands of travelers who plan together with Pravasi.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 transition-all hover:scale-[1.02] hover:bg-white/95 active:scale-[0.98]"
          >
            Start planning for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-4 py-8 theme-transition sm:px-6"
        style={{ borderColor: 'var(--landing-border)' }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg">✈️</span>
            <p className="font-semibold" style={{ color: 'var(--landing-text)' }}>
              Pravasi — Plan together. Travel better.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#features" className="text-sm" style={{ color: 'var(--landing-muted)' }}>Features</a>
            <a href="#how-it-works" className="text-sm" style={{ color: 'var(--landing-muted)' }}>How it works</a>
            <Link to="/login" className="text-sm" style={{ color: 'var(--landing-muted)' }}>Sign in</Link>
            <Link to="/register" className="text-sm font-medium" style={{ color: 'var(--landing-accent)' }}>Get started</Link>
          </div>
          <p className="text-sm" style={{ color: 'var(--landing-muted)' }}>
            © 2026 Pravasi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
