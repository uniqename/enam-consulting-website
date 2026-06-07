import { Plus } from 'lucide-react';

export default function KPIs() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">KPIs</h1>
          <p className="text-stone-600 mt-2">Track your key performance indicators</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
          <Plus size={20} /> Add KPI
        </button>
      </div>

      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-12 text-center">
        <p className="text-stone-600">No KPIs yet. Create your first KPI to start tracking.</p>
      </div>
    </div>
  );
}
