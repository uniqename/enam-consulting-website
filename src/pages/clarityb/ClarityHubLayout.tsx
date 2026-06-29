import { Outlet, ScrollRestoration } from 'react-router';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ClarityHubLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-100 py-3'
            : 'bg-white/50 backdrop-blur-sm py-5 border-b border-stone-100'
        }`}
      >
        <div className="w-full mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo + Branding */}
          <Link
            to="/clarityb"
            className="flex items-center gap-2 group"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">Doxa</span>
              <span className="text-lg font-bold text-emerald-600">ClarityHub</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">BETA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/clarityb"
              className={`text-sm font-medium transition-colors ${
                isActivePath('/clarityb')
                  ? 'text-emerald-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/clarityb/assessment"
              className={`text-sm font-medium transition-colors ${
                isActivePath('/clarityb/assessment')
                  ? 'text-emerald-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Assessment
            </Link>

            {/* Context-aware button */}
            {isAuthenticated ? (
              <Link
                to="/clarityb/portal/dashboard"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                My Portal
              </Link>
            ) : (
              <Link
                to="/clarityb/login"
                className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition-colors"
              >
                Client Login
              </Link>
            )}

            {/* Admin link (subtle) */}
            <Link
              to="/clarityb/admin"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 mt-2 p-4 space-y-3">
            <Link
              to="/clarityb"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-stone-900 hover:text-emerald-600"
            >
              Home
            </Link>
            <Link
              to="/clarityb/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-stone-900 hover:text-emerald-600"
            >
              Assessment
            </Link>
            {isAuthenticated ? (
              <Link
                to="/clarityb/portal/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
              >
                My Portal
              </Link>
            ) : (
              <Link
                to="/clarityb/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-semibold"
              >
                Client Login
              </Link>
            )}
            <Link
              to="/clarityb/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs text-stone-400 hover:text-stone-600"
            >
              Admin
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-24">
        <Outlet />
        <ScrollRestoration />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 mt-24 py-8">
        <div className="w-full mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© 2026 Doxa and Co LLC · ClarityHub</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-stone-900">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-900">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClarityHubLayout;
