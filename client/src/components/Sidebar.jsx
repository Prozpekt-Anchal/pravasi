import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { to: '/dashboard', label: 'Trips' },
];

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return 'U';
}

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-[#2a2a2a]">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="text-xl font-semibold text-[#f5f5f5] tracking-tight">Pravasi</span>
        </Link>
        <p className="text-[#71717a] text-xs mt-1">Plan together. Travel better.</p>
      </div>
      <nav className="flex-1 p-3">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === link.to
                ? 'bg-[#6366f1]/10 text-[#6366f1]'
                : 'text-[#71717a] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1] text-sm font-medium">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f5f5f5] truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-[#71717a] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="w-full mt-2 px-3 py-2 text-sm text-[#71717a] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-lg transition-all duration-200 text-left"
        >
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#1a1a1a] transition-colors"
        aria-label="Open menu"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar (overlay) */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 w-64 h-full bg-[#111111] border-r border-[#2a2a2a] flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1 text-[#71717a] hover:text-[#f5f5f5] transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (static) */}
      <aside className="hidden lg:flex w-56 shrink-0 border-r border-[#2a2a2a] bg-[#111111] flex-col min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
