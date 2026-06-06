import { useEffect, useState } from 'react';
import { BarChart3, FolderKanban, Target, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/.netlify/functions/portal/get-dashboard', {
          headers: { Authorization: `Bearer ${(await fetch('/.netlify/functions/auth/get-session').then(r => r.json())).userId}` },
        });
        if (response.ok) {
          setData(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-600 mt-2">Your business at a glance</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Business Health', value: '73', unit: '%', icon: BarChart3, color: 'emerald' },
          { label: 'Active Projects', value: '2', unit: '', icon: FolderKanban, color: 'blue' },
          { label: 'KPIs On Track', value: '5', unit: '', icon: Target, color: 'teal' },
          { label: 'Overdue Items', value: '0', unit: '', icon: AlertCircle, color: 'red' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-600 uppercase font-semibold">{metric.label}</p>
                  <p className="text-3xl font-bold text-stone-900 mt-2">
                    {metric.value}{metric.unit}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${metric.color}-100 flex items-center justify-center`}>
                  <Icon size={24} className={`text-${metric.color}-600`} />
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
