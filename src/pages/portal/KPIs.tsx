import { Plus, X, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function KPIs() {
  const [kpis, setKpis] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', target: '', current: '', status: 'on-track' });

  useEffect(() => {
    loadKpis();
  }, []);

  const loadKpis = () => {
    setKpis([
      { id: '1', name: 'Monthly Revenue', target: '$500k', current: '$487k', status: 'on-track', progress: 97 },
      { id: '2', name: 'Customer Acquisition', target: '50/mo', current: '42/mo', status: 'at-risk', progress: 84 },
      { id: '3', name: 'Customer Retention', target: '95%', current: '93%', status: 'at-risk', progress: 98 },
      { id: '4', name: 'Operational Efficiency', target: '85%', current: '82%', status: 'on-track', progress: 96 },
      { id: '5', name: 'Team Utilization', target: '80%', current: '78%', status: 'on-track', progress: 97 },
    ]);
    setLoading(false);
  };

  const handleAddKpi = async () => {
    if (!formData.name || !formData.target || !formData.current) return;

    try {
      setSaving(true);

      if (!supabase) {
        // Add to local only
        const newKpi = { ...formData, id: Date.now().toString(), progress: Math.round(Math.random() * 100) };
        setKpis([newKpi, ...kpis]);
        setFormData({ name: '', target: '', current: '', status: 'on-track' });
        setShowForm(false);
        return;
      }

      const { data, error } = await supabase
        .from('kpis')
        .insert([
          {
            name: formData.name,
            target: formData.target,
            current_value: formData.current,
            status: formData.status,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        alert('Error saving KPI: ' + error.message);
      } else {
        setKpis([...data, ...kpis]);
        setFormData({ name: '', target: '', current: '', status: 'on-track' });
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">KPIs</h1>
          <p className="text-stone-600 mt-2">Track your key performance indicators</p>
        </div>
        <button onClick={() => setShowForm(true)} type="button" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
          <Plus size={20} /> Add KPI
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">Add KPI</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="KPI name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <input
                type="text"
                placeholder="Target (e.g., $500k)"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <input
                type="text"
                placeholder="Current value"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddKpi}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                  type="button"
                >
                  {saving && <Loader size={16} className="animate-spin" />}
                  {saving ? 'Saving...' : 'Add KPI'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-lg font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-600" size={32} />
        </div>
      )}

      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-stone-600">{kpi.name}</p>
                <p className="text-2xl font-bold text-stone-900 mt-1">{kpi.current}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                kpi.status === 'on-track' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {kpi.status === 'on-track' ? 'On Track' : 'At Risk'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Target: {kpi.target}</span>
                <span>{kpi.progress}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${kpi.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
