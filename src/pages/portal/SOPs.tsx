import { Plus } from 'lucide-react';

export default function SOPs() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Standard Operating Procedures</h1>
          <p className="text-stone-600 mt-2">Document and manage your business processes</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> New SOP
        </button>
      </div>

      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-12 text-center">
        <p className="text-stone-600">No SOPs yet. Create your first standard operating procedure.</p>
      </div>
    </div>
  );
}
