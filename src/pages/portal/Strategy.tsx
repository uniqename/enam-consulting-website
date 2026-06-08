import { Target, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Strategy() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [vision, setVision] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = () => {
    setVision('To be the trusted business operating system for growing companies');
    setStrategies([
      { id: '1', goal: 'Increase revenue by 40% YoY', progress: 68, quarter: 'Q2 2026' },
      { id: '2', goal: 'Launch 2 new products', progress: 50, quarter: 'Q2-Q3 2026' },
      { id: '3', goal: 'Achieve 95% customer retention', progress: 80, quarter: 'Q2 2026' },
    ]);
    setLoading(false);
  };

  const goals = strategies;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-stone-900">Strategic Planning</h1>
      <p className="text-stone-600 mt-2">Vision, goals, and OKRs</p>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-600" size={32} />
        </div>
      )}

      {!loading && (
      <div className="mt-8">
        <div className="bg-white rounded-2xl border border-stone-100 p-8 mb-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">Vision</h2>
          <p className="text-stone-700 leading-relaxed">
            {vision || 'To be the trusted business operating system for growing companies, enabling them to scale operations without complexity.'}
          </p>
        </div>

        <h2 className="text-xl font-semibold text-stone-900 mb-4">Strategic Goals</h2>
        <div className="space-y-4">
          {goals.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-stone-100 p-6">
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
      )}
    </div>
  );
}
