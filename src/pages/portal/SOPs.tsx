import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';

interface SOP {
  id: string;
  title: string;
  category: string;
  version: number;
  updatedAt: string;
}

export default function SOPs() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSOPs = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-sops', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setSops(result.sops || []);
        }
      } catch (error) {
        console.error('Error fetching SOPs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSOPs();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Standard Operating Procedures</h1>
          <p className="text-stone-600 mt-2">Document and manage your business processes</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> New SOP
        </button>
      </div>

      {sops.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600">No SOPs yet. Create your first standard operating procedure.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sops.map((sop) => (
            <div key={sop.id} className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-emerald-200 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-900">{sop.title}</p>
                  <p className="text-xs text-stone-600 mt-1">{sop.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-600">v{sop.version}</p>
                  <p className="text-xs text-stone-500 mt-1">{new Date(sop.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
