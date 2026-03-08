import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

// CSS for animations
const animationStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-15px) translateX(10px); }
  66% { transform: translateY(5px) translateX(-5px); }
}

@keyframes float-slower {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-25px) translateX(-15px); }
}

@keyframes mockup-float {
  0%, 100% { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(0px); }
  50% { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-10px); }
}

@keyframes shine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
.animate-float-slower { animation: float-slower 10s ease-in-out infinite; }
.animate-mockup-float { animation: mockup-float 4s ease-in-out infinite; }
.animate-shine {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s ease-in-out infinite;
}
.animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
.animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
.animate-fade-in-up-delay-1 { animation: fade-in-up 0.6s ease-out 0.1s forwards; opacity: 0; }
.animate-fade-in-up-delay-2 { animation: fade-in-up 0.6s ease-out 0.2s forwards; opacity: 0; }
.animate-fade-in-up-delay-3 { animation: fade-in-up 0.6s ease-out 0.3s forwards; opacity: 0; }
`;

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

// Hook for scroll-triggered animations
function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

// Social proof avatars
const SOCIAL_PROOF_AVATARS = [
  { initials: 'PS', color: 'from-violet-500 to-purple-600' },
  { initials: 'AM', color: 'from-indigo-500 to-blue-600' },
  { initials: 'RK', color: 'from-emerald-500 to-teal-600' },
  { initials: 'NJ', color: 'from-amber-500 to-orange-600' },
  { initials: 'DM', color: 'from-rose-500 to-pink-600' },
];

export function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();

  return (
    <div className="min-h-screen landing-bg theme-transition" style={{ color: 'var(--landing-text)' }}>
      {/* Inject animation styles */}
      <style>{animationStyles}</style>
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
      <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:pb-40">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-float-slow absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />
          <div
            className="animate-float-slower absolute top-1/4 -right-32 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
          />
          <div
            className="animate-float absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
          />
        </div>

        {/* Dot grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(var(--landing-text) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge with pulsing dot */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium theme-transition animate-fade-in-up"
            style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)', color: 'var(--landing-muted)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Collaborative trip planning, reimagined
          </div>

          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up-delay-1">
            <span className="block" style={{ color: 'var(--landing-text)' }}>Plan together.</span>
            <span className="relative mt-2 block">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                Travel better.
              </span>
              {/* Shine overlay */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-shine"
                aria-hidden="true"
              >
                Travel better.
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg animate-fade-in-up-delay-2" style={{ color: 'var(--landing-muted)' }}>
            The collaborative trip planner for groups who want to go further. Build itineraries, split budgets, and stay in sync — all in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <Link
              to="/register"
              className="rounded-lg px-6 py-3.5 text-base font-medium text-white transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] shadow-lg shadow-indigo-500/25"
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

          {/* Social proof bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <div className="flex -space-x-2">
              {SOCIAL_PROOF_AVATARS.map((avatar, i) => (
                <div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${avatar.color} text-xs font-semibold text-white ring-2 ring-[var(--landing-bg)]`}
                >
                  {avatar.initials}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--landing-muted)' }}>
              Join <span className="font-semibold" style={{ color: 'var(--landing-text)' }}>10,000+</span> travelers planning smarter
            </p>
          </div>

          {/* Browser mockup */}
          <div className="relative mt-16 lg:mt-20 animate-mockup-float">
            {/* Browser window */}
            <div
              className="mx-auto max-w-4xl rounded-xl border overflow-hidden shadow-2xl shadow-black/20"
              style={{
                borderColor: 'var(--landing-border)',
                backgroundColor: 'var(--landing-surface)',
                transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)',
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-bg)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div
                  className="flex-1 ml-4 h-7 rounded-md flex items-center px-3 text-xs"
                  style={{ backgroundColor: 'var(--landing-surface)', color: 'var(--landing-muted)' }}
                >
                  <svg className="w-3 h-3 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  app.pravasi.co/dashboard
                </div>
              </div>

              {/* App content */}
              <div className="flex" style={{ backgroundColor: 'var(--landing-bg)' }}>
                {/* Sidebar */}
                <div
                  className="hidden sm:flex w-48 flex-col border-r p-4"
                  style={{ borderColor: 'var(--landing-border)', backgroundColor: '#111111' }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-lg">✈️</span>
                    <span className="font-semibold text-[#f5f5f5]">Pravasi</span>
                  </div>
                  <div className="space-y-1">
                    <div className="px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-medium">Trips</div>
                    <div className="px-3 py-2 text-[#71717a] text-sm">Settings</div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-medium">PS</div>
                      <div className="text-xs">
                        <p className="text-[#f5f5f5] font-medium">Priya</p>
                        <p className="text-[#71717a]">priya@email.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--landing-text)' }}>My Trips</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a1a1a] text-[#71717a]">3</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium">+ New Trip</div>
                  </div>

                  {/* Trip cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}>
                      <div className="h-2 w-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 mb-3"></div>
                      <p className="font-semibold" style={{ color: 'var(--landing-text)' }}>Bali Adventure</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--landing-muted)' }}>12–22 Dec · 4 members</p>
                      <div className="flex -space-x-1 mt-3">
                        <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">P</div>
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">A</div>
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">S</div>
                      </div>
                    </div>
                    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}>
                      <div className="h-2 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 mb-3"></div>
                      <p className="font-semibold" style={{ color: 'var(--landing-text)' }}>Kerala Backwaters</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--landing-muted)' }}>5–10 Jan · 2 members</p>
                      <div className="flex -space-x-1 mt-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">R</div>
                        <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">N</div>
                      </div>
                    </div>
                    <div className="hidden lg:block rounded-xl border p-4" style={{ borderColor: 'var(--landing-border)', backgroundColor: 'var(--landing-surface)' }}>
                      <div className="h-2 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 mb-3"></div>
                      <p className="font-semibold" style={{ color: 'var(--landing-text)' }}>Euro Trip 2025</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--landing-muted)' }}>15–30 Mar · 6 members</p>
                      <div className="flex -space-x-1 mt-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">D</div>
                        <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">M</div>
                        <div className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">K</div>
                        <div className="w-6 h-6 rounded-full bg-[#2a2a2a] text-[#71717a] text-xs flex items-center justify-center ring-2 ring-[var(--landing-surface)]">+3</div>
                      </div>
                    </div>
                  </div>
                </div>
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
      <section id="features" className="px-4 py-24 sm:px-6 sm:py-32" ref={featuresRef}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`text-center text-3xl font-bold sm:text-4xl transition-all duration-700 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Everything you need to plan as a team
            </span>
          </h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, index) => (
              <div
                key={f.title}
                className={`group relative rounded-2xl border p-6 transition-all duration-500 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 overflow-hidden ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  borderColor: 'var(--landing-border)',
                  backgroundColor: 'var(--landing-surface)',
                  transitionDelay: featuresVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                {/* Top gradient line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-80"
                  style={{
                    background: f.title.includes('Itinerary')
                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                      : f.title.includes('Collaboration')
                      ? 'linear-gradient(90deg, #10b981, #14b8a6)'
                      : 'linear-gradient(90deg, #f59e0b, #f97316)',
                  }}
                />
                {/* Glowing icon */}
                <div
                  className={`inline-flex rounded-xl p-3 ${f.color}`}
                  style={{
                    boxShadow: f.title.includes('Itinerary')
                      ? '0 0 20px rgba(99, 102, 241, 0.3)'
                      : f.title.includes('Collaboration')
                      ? '0 0 20px rgba(16, 185, 129, 0.3)'
                      : '0 0 20px rgba(245, 158, 11, 0.3)',
                  }}
                >
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
      <section id="how-it-works" className="border-t px-4 py-24 theme-transition sm:px-6 sm:py-32" style={{ borderColor: 'var(--landing-border)' }} ref={howItWorksRef}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`text-center text-3xl font-bold sm:text-4xl transition-all duration-700 ${
              howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: 'var(--landing-text)' }}
          >
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
      <section id="testimonials" className="px-4 py-24 sm:px-6 sm:py-32" ref={testimonialsRef}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`text-center text-3xl font-bold sm:text-4xl transition-all duration-700 ${
              testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ color: 'var(--landing-text)' }}
          >
            Loved by travelers
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-6 theme-transition transition-all duration-500 ${i === 1 ? 'lg:mt-8' : ''} ${
                  testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  borderColor: 'var(--landing-border)',
                  backgroundColor: 'var(--landing-surface)',
                  transitionDelay: testimonialsVisible ? `${i * 100}ms` : '0ms',
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
