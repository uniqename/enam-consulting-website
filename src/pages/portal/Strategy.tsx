import { Target } from 'lucide-react';

export default function Strategy() {
  const goals = [
    { goal: 'Increase revenue by 40% YoY', progress: 68, quarter: 'Q2 2026' },
    { goal: 'Launch 2 new products', progress: 50, quarter: 'Q2-Q3 2026' },
    { goal: 'Achieve 95% customer retention', progress: 80, quarter: 'Q2 2026' },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-stone-900">Strategic Planning</h1>
      <p className="text-stone-600 mt-2">Vision, goals, and OKRs</p>

      <div className="mt-8">
        <div className="bg-white rounded-2xl border border-stone-100 p-8 mb-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">Vision</h2>
          <p className="text-stone-700 leading-relaxed">
            To be the trusted business operating system for growing companies, enabling them to scale operations without complexity.
          </p>
        </div>

        <h2 className="text-xl font-semibold text-stone-900 mb-4">Strategic Goals</h2>
        <div className="space-y-4">
          {goals.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="flex items-start gap-3">
                <Target className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-stone-900">{item.goal}</p>
                  <p className="text-sm text-stone-600 mt-2">{item.quarter}</p>
                  <div className="mt-4 w-full bg-stone-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-stone-600 mt-2">{item.progress}% complete</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
