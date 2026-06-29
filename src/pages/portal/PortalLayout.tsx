import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { LogOut, Menu, X, LayoutDashboard, BarChart3, FileText, Folder, CheckSquare, Users, Target, Settings } from 'lucide-react';

export default function PortalLayout() {
  const [user, setUser] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // TODO: TEMPORARY - Bypass auth for testing. Remove this before production.
      if (!supabase) {
        setUser({ email: 'admin@test.local', id: 'test-user' });
        setOrg({ name: 'Test Organization', id: 'test-org' });
        setLoading(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        setOrg({ name: 'Doxa & Co', id: 'doxa-org' });
      } else {
        setUser({ email: 'admin@test.local', id: 'test-user' });
        setOrg({ name: 'Doxa & Co', id: 'doxa-org' });
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/portal/dashboard' },
    { label: 'Health', icon: BarChart3, path: '/portal/health' },
    { label: 'KPIs', icon: Target, path: '/portal/kpis' },
    { label: 'SOPs', icon: FileText, path: '/portal/sops' },
    { label: 'GRC', icon: CheckSquare, path: '/portal/grc' },
    { label: 'Projects', icon: Folder, path: '/portal/projects' },
    { label: 'Strategy', icon: Target, path: '/portal/strategy' },
    { label: 'CRM', icon: Users, path: '/portal/crm' },
    { label: 'Settings', icon: Settings, path: '/portal/settings' },
  ];

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-stone-200 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-200">
            <h1 className="text-2xl font-bold text-emerald-600">DoxaOS</h1>
            {org && <p className="text-xs text-stone-600 mt-2">{org.name}</p>}
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-stone-200 space-y-2">
            <p className="text-xs text-stone-600 px-4">{user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-stone-900 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between md:hidden">
          <h2 className="font-semibold text-stone-900">DoxaOS</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-stone-600 hover:text-stone-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
