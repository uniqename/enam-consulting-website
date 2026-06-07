import { AlertTriangle, AlertCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function GRC() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        setRisks([
          { id: '1', title: 'Key Person Risk', severity: 'high', probability: 'Medium', impact: 'High', status: 'monitored' },
          { id: '2', title: 'Cash Flow Volatility', severity: 'medium', probability: 'Medium', impact: 'Medium', status: 'mitigating' },
          { id: '3', title: 'Data Security Gaps', severity: 'medium', probability: 'Low', impact: 'High', status: 'monitored' },
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching risks:', error.message);
        setRisks([]);
      } else {
        setRisks(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-stone-900">Governance, Risk & Compliance</h1>
      <p className="text-stone-600 mt-2">Risk register, policies, and audit trail</p>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-600" size={32} />
        </div>
      )}

      {!loading && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-stone-900 mb-4">Risk Register</h2>
        <div className="space-y-4">
          {risks.map((risk) => (
            <div key={risk.id} className="bg-white rounded-2xl border border-stone-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {risk.severity === 'high' ? (
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  ) : (
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  )}
                  <div>
                    <p className="font-semibold text-stone-900">{risk.title}</p>
                    <p className="text-sm text-stone-600 mt-1">Probability: {risk.probability} • Impact: {risk.impact}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-semibold ${
                  risk.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {risk.severity === 'high' ? 'High' : 'Medium'}
                </div>
              </div>
              <div className="text-xs text-stone-600 mt-3 p-3 bg-stone-50 rounded">
                Status: <span className="font-semibold text-stone-900">{risk.status === 'monitored' ? 'Monitored' : 'Actively Mitigating'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
