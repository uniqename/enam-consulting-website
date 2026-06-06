import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  target: number;
  unit: string;
  frequency: string;
  latestValue?: number;
  trend?: number;
}

export default function KPIs() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', unit: '', target: '', frequency: 'MONTHLY' });

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-kpis', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setKpis(result.kpis || []);
        }
      } catch (error) {
        console.error('Error fetching KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const handleAddKPI = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch('/.netlify/functions/kpis/create-kpi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          unit: formData.unit,
          target: parseFloat(formData.target),
          frequency: formData.frequency,
        }),
      });

      if (response.ok) {
        const newKPI = await response.json();
        setKpis([...kpis, newKPI]);
        setFormData({ name: '', unit: '', target: '', frequency: 'MONTHLY' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating KPI:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">KPIs</h1>
          <p className="text-stone-600 mt-2">Track your key performance indicators</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} /> Add KPI
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddKPI} className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="KPI Name (e.g., Revenue)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Unit (e.g., $, units, %)"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Target Value"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              required
            />
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-6 py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-lg font-semibold">
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-stone-200 text-stone-900 rounded-lg font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {kpis.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600">No KPIs yet. Create your first KPI to start tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="bg-white rounded-2xl border border-stone-100 p-6">
              <p className="text-xs text-stone-600 uppercase font-semibold">{kpi.name}</p>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                {kpi.latestValue || 0} <span className="text-lg text-stone-500">{kpi.unit}</span>
              </p>
              <p className="text-xs text-stone-500 mt-2">Target: {kpi.target} {kpi.unit}</p>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-600">{kpi.frequency}</p>
                {kpi.trend !== undefined && (
                  <p className={`text-sm font-semibold mt-1 ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
