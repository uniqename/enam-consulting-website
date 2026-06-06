import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface StrategicGoal {
  id: string;
  goal: string;
  status: string;
  progress?: number;
}

export default function Strategy() {
  const [data, setData] = useState<{ vision?: string; goals: StrategicGoal[] }>({ goals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-strategy', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching strategy:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategy();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-stone-900">Strategic Planning</h1>
      <p className="text-stone-600 mt-2">Vision, goals, and OKRs</p>

      {data.vision && (
        <div className="mt-8 bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-2">Vision</p>
          <p className="text-xl text-stone-900">{data.vision}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">Strategic Goals</h2>
        {data.goals.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-600">No goals defined yet</div>
        ) : (
          <div className="space-y-3">
            {data.goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-2xl border border-stone-100 p-4">
                <p className="font-semibold text-stone-900">{goal.goal}</p>
                <p className="text-xs text-stone-600 mt-1">{goal.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
