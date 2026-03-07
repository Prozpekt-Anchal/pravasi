import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { to: '/dashboard', label: 'Trips' },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 border-r border-[#2a2a2a] bg-[#111111] flex flex-col min-h-screen">
      <div className="p-4 border-b border-[#2a2a2a]">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-[#f5f5f5] tracking-tight">Pravasi</span>
        </Link>
        <p className="text-[#71717a] text-xs mt-1">Plan together. Travel better.</p>
      </div>
      <nav className="flex-1 p-3">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
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
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f5f5f5] truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-[#71717a] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full mt-2 px-3 py-2 text-sm text-[#71717a] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] rounded-lg transition-all duration-200 text-left"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
