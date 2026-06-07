import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Health() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('doxa_assessments');
    if (saved) {
      setAssessments(JSON.parse(saved));
    } else {
      setAssessments([
        { date: '2026-06-06', score: 78, status: 'Excellent', trend: 'up', change: 5 },
        { date: '2026-05-06', score: 73, status: 'Good', trend: 'up', change: 8 },
        { date: '2026-03-15', score: 65, status: 'Fair', trend: 'down', change: -3 },
      ]);
    }
  }, []);

  const handleTakeAssessment = () => {
    const score = Math.floor(Math.random() * 35) + 60;
    const status = score >= 80 ? 'Excellent' : score >= 70 ? 'Good' : 'Fair';
    const lastScore = assessments[0]?.score || 70;
    const change = score - lastScore;
    const trend = change >= 0 ? 'up' : 'down';
    const today = new Date().toISOString().split('T')[0];

    const newAssessment = { date: today, score, status, trend, change: Math.abs(change) };
    const updated = [newAssessment, ...assessments];
    setAssessments(updated);
    localStorage.setItem('doxa_assessments', JSON.stringify(updated));
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Business Health</h1>
        <p className="text-stone-600 mt-2">Assessment history and domain analysis</p>
      </div>

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
        {assessments.map((assessment, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
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
    </div>
  );
}
