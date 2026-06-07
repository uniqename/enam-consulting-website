import { Plus, FileText, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SOPs() {
  const [sops, setSops] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'Operations', lastUpdated: '', status: 'active' });

  useEffect(() => {
    const saved = localStorage.getItem('doxa_sops');
    if (saved) {
      setSops(JSON.parse(saved));
    } else {
      setSops([
        { title: 'Sales Process v2.1', category: 'Sales', lastUpdated: '2026-06-01', status: 'active' },
        { title: 'Customer Onboarding', category: 'Operations', lastUpdated: '2026-05-15', status: 'active' },
        { title: 'Product Development Workflow', category: 'Engineering', lastUpdated: '2026-04-20', status: 'active' },
        { title: 'Financial Reporting Checklist', category: 'Finance', lastUpdated: '2026-03-10', status: 'review' },
      ]);
    }
  }, []);

  const handleAddSop = () => {
    if (!formData.title) return;
    const today = new Date().toISOString().split('T')[0];
    const updated = [...sops, { ...formData, lastUpdated: today }];
    setSops(updated);
    localStorage.setItem('doxa_sops', JSON.stringify(updated));
    setFormData({ title: '', category: 'Operations', lastUpdated: '', status: 'active' });
    setShowForm(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Standard Operating Procedures</h1>
          <p className="text-stone-600 mt-2">Document and manage your business processes</p>
        </div>
        <button onClick={() => setShowForm(true)} type="button" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> New SOP
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">New SOP</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600" type="button">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="SOP title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="active">Active</option>
                <option value="review">In Review</option>
                <option value="draft">Draft</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSop}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm"
                  type="button"
                >
                  Create SOP
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-lg font-semibold text-sm"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sops.map((sop, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">{sop.title}</p>
                <p className="text-sm text-stone-600 mt-1">{sop.category} • Updated {sop.lastUpdated}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-xs font-semibold ${
              sop.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {sop.status === 'active' ? 'Active' : 'In Review'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
