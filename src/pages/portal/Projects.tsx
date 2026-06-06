import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, CheckCircle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: string;
  progress: number;
  dueDate?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-projects', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setProjects(result.projects || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

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

      {projects.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-600">No projects yet</div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-stone-900">{project.title}</p>
                <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">{project.status}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <p className="text-xs text-stone-600">{project.progress}% complete</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
