import { Check } from 'lucide-react';

export default function Projects() {
  const phases = [
    { name: 'Discover', color: 'blue' },
    { name: 'Analyze', color: 'purple' },
    { name: 'Design', color: 'amber' },
    { name: 'Implement', color: 'emerald' },
    { name: 'Optimize', color: 'teal' },
  ];

  const projects = [
    {
      title: 'Operations Optimization',
      phase: 'implement',
      milestones: [
        { title: 'Current State Assessment', completed: true },
        { title: 'Gap Analysis Report', completed: true },
        { title: 'SOP Documentation', completed: false },
        { title: 'Team Training', completed: false },
      ],
    },
    {
      title: 'Technology Infrastructure',
      phase: 'design',
      milestones: [
        { title: 'Discovery Interviews', completed: true },
        { title: 'System Architecture Review', completed: false },
        { title: 'Implementation Roadmap', completed: false },
      ],
    },
  ];

  const phaseColor = (phase: string) => {
    const p = phases.find(ph => ph.name.toLowerCase() === phase.toLowerCase());
    return p?.color || 'stone';
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Your Projects</h1>
        <p className="text-stone-600">Track the five-phase roadmap to your business goals</p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-stone-900 mb-3">{project.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-${phaseColor(project.phase)}-100 text-${phaseColor(project.phase)}-700`}>
                  Phase: {project.phase.charAt(0).toUpperCase() + project.phase.slice(1)}
                </span>
              </div>

              <div className="space-y-3">
                {project.milestones.map((milestone, j) => (
                  <div key={j} className="flex items-start gap-4 p-4 rounded-lg bg-stone-50">
                    <div className={`w-6 h-6 rounded-full mt-0.5 flex items-center justify-center flex-shrink-0 ${
                      milestone.completed
                        ? 'bg-emerald-600'
                        : 'border-2 border-stone-300'
                    }`}>
                      {milestone.completed && <Check size={16} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.completed ? 'text-stone-600 line-through' : 'text-stone-900'}`}>
                        {milestone.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-sm text-stone-600">
                  Progress: <span className="font-semibold text-stone-900">
                    {project.milestones.filter(m => m.completed).length} of {project.milestones.length}
                  </span> completed
                </p>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-600"
                    style={{ width: `${(project.milestones.filter(m => m.completed).length / project.milestones.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600 mb-4">Your project roadmap will appear here.</p>
          <p className="text-stone-500 text-sm">Once your consultant sets up your engagement, you will see your five-phase project here.</p>
        </div>
      )}
    </div>
  );
}
