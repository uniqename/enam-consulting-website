import { Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', phase: 'Planning', progress: 0, dueDate: '' });

  useEffect(() => {
    const saved = localStorage.getItem('doxa_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects([
        { title: 'Website Redesign', phase: 'Implementation', progress: 65, dueDate: '2026-07-15' },
        { title: 'CRM Migration', phase: 'Planning', progress: 30, dueDate: '2026-08-30' },
        { title: 'Team Training Program', phase: 'Execution', progress: 90, dueDate: '2026-06-20' },
      ]);
    }
  }, []);

  const handleAddProject = () => {
    if (!formData.title || !formData.dueDate) return;
    const updated = [...projects, formData];
    setProjects(updated);
    localStorage.setItem('doxa_projects', JSON.stringify(updated));
    setFormData({ title: '', phase: 'Planning', progress: 0, dueDate: '' });
    setShowForm(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Projects</h1>
          <p className="text-stone-600 mt-2">Track projects and milestones</p>
        </div>
        <button onClick={() => setShowForm(true)} type="button" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> New Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">New Project</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="Planning">Planning</option>
                <option value="Implementation">Implementation</option>
                <option value="Execution">Execution</option>
                <option value="Completion">Completion</option>
              </select>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-sm text-stone-600">Progress: {formData.progress}%</p>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddProject}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm"
                >
                  Add Project
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

      <div className="space-y-4">
        {projects.map((project, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-stone-900">{project.title}</p>
                <p className="text-sm text-stone-600 mt-1">{project.phase} • Due {project.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-stone-900">{project.progress}%</p>
              </div>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
