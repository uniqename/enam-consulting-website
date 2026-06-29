import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { LogOut, TrendingUp, DollarSign, Calendar, Briefcase } from 'lucide-react';
import OutreachTracker from './OutreachTracker';
import RevenueModel from './RevenueModel';
import FounderCalendar from './FounderCalendar';
import EventsTracker from './EventsTracker';

const OWNER_EMAIL = 'ename@doxaandco.co';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const FounderRoute = () => {
  const [activeTab, setActiveTab] = useState('outreach');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Check if owner is authenticated
  const storedEmail = sessionStorage.getItem('clarity_founder_email');
  const isOwner = storedEmail === OWNER_EMAIL || sessionStorage.getItem('founder_mode') === '1';

  if (!isOwner) {
    return <Navigate to="/clarityb" replace />;
  }

  const tabs: Tab[] = [
    {
      id: 'outreach',
      label: 'Outreach Tracker',
      icon: <TrendingUp size={20} />,
      component: <OutreachTracker />,
    },
    {
      id: 'revenue',
      label: 'Revenue Model',
      icon: <DollarSign size={20} />,
      component: <RevenueModel />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar size={20} />,
      component: <FounderCalendar />,
    },
    {
      id: 'events',
      label: 'Events Tracker',
      icon: <Briefcase size={20} />,
      component: <EventsTracker />,
    },
  ];

  const activeTabObj = tabs.find((t) => t.id === activeTab);

  const handleLogout = () => {
    sessionStorage.removeItem('clarity_founder_email');
    sessionStorage.removeItem('founder_mode');
    navigate('/clarityb');
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-100 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-stone-900">Founder Dashboard</h2>
          <p className="text-xs text-stone-500 mt-1">Private Owner Tools</p>
        </div>

        <nav className="space-y-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors"
          >
            <LogOut size={18} /> Exit
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-stone-900">{activeTabObj?.label}</h1>
          <p className="text-sm text-stone-500 mt-1">Business development and planning tools</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
          {activeTabObj?.component}
        </div>
      </main>
    </div>
  );
};

export default FounderRoute;
