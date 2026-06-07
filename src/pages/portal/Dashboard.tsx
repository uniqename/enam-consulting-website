import { useEffect, useState } from 'react';
import { BarChart3, FolderKanban, Target, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardData {
  healthScore: number;
  activeProjects: number;
  kpisOnTrack: number;
  overdueItems: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Try to fetch dashboard data with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const response = await fetch('/.netlify/functions/portal/get-dashboard', {
            headers: { Authorization: `Bearer ${session.session.access_token}` },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const result = await response.json();
            setData({
              healthScore: result.healthScore || 0,
              activeProjects: result.activeProjects || 0,
              kpisOnTrack: result.kpisOnTrack || 0,
              overdueItems: result.overdueItems || 0,
            });
          } else {
            // If fetch fails, show default data
            setData({
              healthScore: 0,
              activeProjects: 0,
              kpisOnTrack: 0,
              overdueItems: 0,
            });
          }
        } catch (fetchErr) {
          // Timeout or network error - use default data
          setData({
            healthScore: 0,
            activeProjects: 0,
            kpisOnTrack: 0,
            overdueItems: 0,
          });
        }
      } catch (err: any) {
        console.error('Dashboard error:', err);
        // Use default data on error
        setData({
          healthScore: 0,
          activeProjects: 0,
          kpisOnTrack: 0,
          overdueItems: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  const metrics = [
    { label: 'Business Health', value: data?.healthScore || 0, unit: '%', icon: BarChart3, color: 'emerald' },
    { label: 'Active Projects', value: data?.activeProjects || 0, unit: '', icon: FolderKanban, color: 'blue' },
    { label: 'KPIs On Track', value: data?.kpisOnTrack || 0, unit: '', icon: Target, color: 'teal' },
    { label: 'Overdue Items', value: data?.overdueItems || 0, unit: '', icon: AlertCircle, color: 'red' },
  ];

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-600 mt-2">Your business at a glance</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          const colorClasses: { [key: string]: { bg: string; text: string } } = {
            emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
            blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
            teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
            red: { bg: 'bg-red-100', text: 'text-red-600' },
          };
          const colors = colorClasses[metric.color] || colorClasses.emerald;

          return (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-600 uppercase font-semibold">{metric.label}</p>
                  <p className="text-3xl font-bold text-stone-900 mt-2">
                    {metric.value}{metric.unit}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon size={24} className={colors.text} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8">
        <h2 className="text-xl font-bold text-stone-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Take Assessment', 'Add KPI', 'New Invoice'].map((action, i) => (
            <button
              key={i}
              className="px-6 py-4 rounded-lg border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
