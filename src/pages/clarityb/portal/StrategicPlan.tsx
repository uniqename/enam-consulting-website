import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

export default function StrategicPlan() {
  const [vision, setVision] = useState('');
  const [visionEditing, setVisionEditing] = useState(false);

  const annualGoals = [
    { goal: 'Increase revenue by 25%', status: 'in-progress' },
    { goal: 'Improve operational efficiency by 20%', status: 'planning' },
    { goal: 'Build comprehensive SOP documentation', status: 'in-progress' },
    { goal: 'Establish KPI dashboard and tracking', status: 'planning' },
  ];

  const quarters = [
    {
      quarter: 'Q1',
      focus: 'Discover & Assess',
      objectives: [
        'Complete comprehensive business assessment',
        'Identify key pain points and opportunities',
        'Prioritize improvement areas',
      ],
    },
    {
      quarter: 'Q2',
      focus: 'Analyze & Design',
      objectives: [
        'Develop improvement roadmap',
        'Create SOP templates',
        'Design new processes',
      ],
    },
    {
      quarter: 'Q3',
      focus: 'Implement & Execute',
      objectives: [
        'Roll out new systems and processes',
        'Train team on changes',
        'Monitor early results',
      ],
    },
    {
      quarter: 'Q4',
      focus: 'Optimize & Review',
      objectives: [
        'Fine-tune processes based on results',
        'Plan next year priorities',
        'Celebrate wins and learnings',
      ],
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Strategic Plan</h1>
        <p className="text-stone-600">Your vision, goals, and quarterly roadmap</p>
      </div>

      {/* Vision Section */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-stone-900">Vision & Mission</h2>
          {!visionEditing && (
            <button
              type="button"
              onClick={() => setVisionEditing(true)}
              className="p-2 text-stone-600 hover:text-stone-900"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>

        {visionEditing ? (
          <div className="space-y-4">
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Describe your vision for the business..."
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none resize-none"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisionEditing(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Save size={16} /> Save
              </button>
              <button
                type="button"
                onClick={() => setVisionEditing(false)}
                className="px-4 py-2 rounded-lg border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-stone-700">
            {vision || 'No vision statement yet. Click edit to add one.'}
          </p>
        )}
      </div>

      {/* Annual Goals */}
      <div className="bg-white rounded-2xl border border-stone-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Annual Goals</h2>
        <div className="space-y-4">
          {annualGoals.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-stone-50">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded border-stone-300" />
              <div>
                <p className="font-medium text-stone-900">{item.goal}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'in-progress'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status === 'in-progress' ? 'In Progress' : 'Planning'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly Planning */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">Quarterly Planning (2026)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quarters.map((q, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-stone-900">{q.quarter}</h3>
                <p className="text-sm text-stone-600 font-medium">{q.focus}</p>
              </div>
              <div className="space-y-3">
                {q.objectives.map((obj, j) => (
                  <label key={j} className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-stone-300" />
                    <span className="text-sm text-stone-700">{obj}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
