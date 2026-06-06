import { Link } from 'react-router';
import { BarChart3 } from 'lucide-react';

export default function Assessments() {
  const assessments = [
    { date: '2026-05-15', score: 73, tier: 'Good Foundation' },
    { date: '2026-02-10', score: 68, tier: 'Good Foundation' },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Critical':
        return 'bg-red-100 text-red-700';
      case 'Needs Work':
        return 'bg-amber-100 text-amber-700';
      case 'Good Foundation':
        return 'bg-emerald-100 text-emerald-700';
      case 'Optimized':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Your Assessments</h1>
        <p className="text-stone-600">Track your business health over time</p>
      </div>

      <div className="mb-8">
        <Link
          to="/clarityb/assessment"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
        >
          <BarChart3 size={18} className="mr-2" /> Take a New Assessment
        </Link>
      </div>

      {assessments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Tier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment, i) => (
                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-6 py-4 text-sm text-stone-900">{assessment.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-stone-900">{assessment.score}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTierColor(assessment.tier)}`}>
                      {assessment.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600 mb-4">You haven't completed any assessments yet.</p>
          <p className="text-stone-500 text-sm">Start your first assessment to see your business health score.</p>
        </div>
      )}
    </div>
  );
}
