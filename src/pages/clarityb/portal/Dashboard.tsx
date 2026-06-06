import { TrendingUp, FolderKanban, Target, Calendar } from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    { label: 'Business Health Score', value: 73, unit: '%', icon: TrendingUp, color: 'emerald' },
    { label: 'Active Projects', value: 2, unit: '', icon: FolderKanban, color: 'blue' },
    { label: 'KPIs On Track', value: 5, unit: '', icon: Target, color: 'teal' },
    { label: 'Days Since Last Assessment', value: 45, unit: 'd', icon: Calendar, color: 'amber' },
  ];

  const projects = [
    {
      title: 'Operations Optimization',
      phase: 'implement',
      progress: 65,
      nextMilestone: 'SOP Documentation',
      daysUntil: 14,
    },
    {
      title: 'Technology Infrastructure',
      phase: 'design',
      progress: 40,
      nextMilestone: 'System Architecture Review',
      daysUntil: 21,
    },
  ];

  const phaseColor = (phase: string) => {
    switch (phase) {
      case 'discover':
        return 'bg-blue-100 text-blue-700';
      case 'analyze':
        return 'bg-purple-100 text-purple-700';
      case 'design':
        return 'bg-amber-100 text-amber-700';
      case 'implement':
        return 'bg-emerald-100 text-emerald-700';
      case 'optimize':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
        <p className="text-stone-600">Welcome back! Here is your business at a glance.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-2xl border border-stone-100 p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${metric.color}-100 flex items-center justify-center text-${metric.color}-600`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
                {metric.label}
              </p>
              <p className="text-3xl font-bold text-stone-900">
                {metric.value}<span className="text-lg text-stone-600">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Projects */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Active Projects</h2>
        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-2">{project.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${phaseColor(project.phase)}`}>
                      {project.phase.charAt(0).toUpperCase() + project.phase.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-900">{project.progress}%</p>
                    <p className="text-xs text-stone-500">Complete</p>
                  </div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-600"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-sm text-stone-600">
                  Next: <span className="font-semibold text-stone-900">{project.nextMilestone}</span> in {project.daysUntil} days
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
              <p className="text-stone-600">No active projects yet. Your roadmap will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            className="px-6 py-4 rounded-xl border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold transition-colors"
          >
            Take New Assessment
          </button>
          <button
            type="button"
            className="px-6 py-4 rounded-xl border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold transition-colors"
          >
            Add KPI
          </button>
          <button
            type="button"
            className="px-6 py-4 rounded-xl border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold transition-colors"
          >
            View Documents
          </button>
        </div>
      </div>
    </div>
  );
}
