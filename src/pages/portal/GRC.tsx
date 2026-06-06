import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle } from 'lucide-react';

interface Risk {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
}

export default function GRC() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-risks', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setRisks(result.risks || []);
        }
      } catch (error) {
        console.error('Error fetching risks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const severityColors: { [key: string]: string } = {
    LOW: 'text-blue-600 bg-blue-50',
    MEDIUM: 'text-yellow-600 bg-yellow-50',
    HIGH: 'text-orange-600 bg-orange-50',
    CRITICAL: 'text-red-600 bg-red-50',
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-stone-900">Governance, Risk & Compliance</h1>
      <p className="text-stone-600 mt-2">Risk register, policies, and audit trail</p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">Risk Register</h2>
        {risks.length === 0 ? (
          <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-600">No risks identified yet</div>
        ) : (
          <div className="space-y-3">
            {risks.map((risk) => (
              <div key={risk.id} className={`rounded-lg p-4 flex items-center gap-3 ${severityColors[risk.severity]}`}>
                <AlertTriangle size={20} />
                <div className="flex-1">
                  <p className="font-semibold">{risk.title}</p>
                  <p className="text-xs opacity-75">{risk.severity}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-white/50 rounded">{risk.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
