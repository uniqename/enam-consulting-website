import { TrendingUp, TrendingDown, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Health() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    setAssessments([
      { id: '1', date: '2026-06-06', score: 78, status: 'Excellent', trend: 'up', change: 5 },
      { id: '2', date: '2026-05-06', score: 73, status: 'Good', trend: 'up', change: 8 },
      { id: '3', date: '2026-03-15', score: 65, status: 'Fair', trend: 'down', change: 3 },
    ]);
    setLoading(false);
  };

  const handleTakeAssessment = async () => {
    const score = Math.floor(Math.random() * 35) + 60;
    const status = score >= 80 ? 'Excellent' : score >= 70 ? 'Good' : 'Fair';
    const lastScore = assessments[0]?.score || 70;
    const change = Math.abs(score - lastScore);
    const trend = score >= lastScore ? 'up' : 'down';
    const today = new Date().toISOString().split('T')[0];

    if (!supabase) {
      const newAssessment = { id: Date.now().toString(), date: today, score, status, trend, change };
      setAssessments([newAssessment, ...assessments]);
      return;
    }

    const { data, error } = await supabase
      .from('health_checks')
      .insert([{ date: today, score, status, trend, change }])
      .select();

    if (error) {
      alert('Error saving assessment: ' + error.message);
    } else {
      setAssessments([...data, ...assessments]);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Business Health</h1>
        <p className="text-stone-600 mt-2">Assessment history and domain analysis</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-600" size={32} />
        </div>
      )}

      {!loading && (
      <>
      <div className="mb-8">
        <button
          onClick={handleTakeAssessment}
          type="button"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
        >
          Take Assessment
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-stone-600">{assessment.date}</p>
                <p className="text-3xl font-bold text-stone-900 mt-2">{assessment.score}/100</p>
                <p className="text-sm font-semibold text-emerald-600 mt-1">{assessment.status}</p>
              </div>
              <div className="flex items-center gap-2">
                {assessment.trend === 'up' ? (
                  <TrendingUp className="text-emerald-600" size={20} />
                ) : (
                  <TrendingDown className="text-red-600" size={20} />
                )}
                <span className={assessment.trend === 'up' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {assessment.trend === 'up' ? '+' : ''}{assessment.change}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {['Operations', 'Finance', 'Systems', 'Team'].map((domain, j) => (
                <div key={j} className="bg-stone-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-stone-600">{domain}</p>
                  <p className="text-lg font-bold text-stone-900 mt-1">{72 + j * 3}/100</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
