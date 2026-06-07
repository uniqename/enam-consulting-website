import { Plus } from 'lucide-react';

export default function Projects() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Projects</h1>
          <p className="text-stone-600 mt-2">Track projects and milestones</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> New Project
        </button>
      </div>

      <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-600">No projects yet</div>
    </div>
  );
}
