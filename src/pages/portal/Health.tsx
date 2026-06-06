import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Assessment {
  id: string;
  score: number;
  tier: string;
  createdAt: string;
  breakdown?: { operations: number; finance: number; systems: number; team: number };
}

export default function Health() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-assessments', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setAssessments(result.assessments || []);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Business Health</h1>
        <p className="text-stone-600 mt-2">Assessment history and domain analysis</p>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600">No assessments yet. Take your first assessment to see your business health score.</p>
          <button className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
            Take Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-stone-600 uppercase font-semibold">Score</p>
                  <p className="text-4xl font-bold text-stone-900 mt-1">{assessment.score}</p>
                  <p className="text-sm text-stone-600 mt-2">{assessment.tier}</p>
                </div>
                <p className="text-sm text-stone-500">{new Date(assessment.createdAt).toLocaleDateString()}</p>
              </div>

              {assessment.breakdown && (
                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
                  {Object.entries(assessment.breakdown).map(([domain, score]) => (
                    <div key={domain}>
                      <p className="text-xs text-stone-600 uppercase font-semibold">{domain}</p>
                      <p className="text-2xl font-bold text-stone-900 mt-1">{score}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
