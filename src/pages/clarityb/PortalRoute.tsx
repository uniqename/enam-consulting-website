import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router';
import { LogOut, LayoutDashboard, ClipboardList, FolderKanban, FileText, BarChart3, Users, Target, Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PortalRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/clarityb/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <Navigate to="/clarityb/login" replace />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/clarityb/portal/dashboard' },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList, path: '/clarityb/portal/assessments' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/clarityb/portal/projects' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/clarityb/portal/documents' },
    { id: 'kpis', label: 'KPIs', icon: BarChart3, path: '/clarityb/portal/kpis' },
    { id: 'team', label: 'Team', icon: Users, path: '/clarityb/portal/team' },
    { id: 'strategic-plan', label: 'Strategic Plan', icon: Target, path: '/clarityb/portal/strategic-plan' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-stone-100 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:z-0`}
      >
        <div className="p-6 border-b border-stone-100">
          <h3 className="font-bold text-stone-900 mb-1">ClarityHub</h3>
          <p className="text-xs text-stone-500 truncate">{userEmail}</p>
        </div>

        <nav className="p-4 flex-1">
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActivePath(item.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-stone-900 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-24 md:pt-0">
        {/* Top bar for mobile */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-stone-600 hover:text-stone-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-semibold text-stone-900">ClarityHub</span>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PortalRoute;
