import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

interface OrgSettings {
  name?: string;
  plan?: string;
  memberCount?: number;
}

export default function Settings() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-org-settings', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setOrg(result);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900">Settings</h1>

      <div className="mt-8 space-y-6">
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-2">Organization</p>
          <p className="text-xl font-bold text-stone-900">{org?.name || 'Loading...'}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-2">Plan</p>
          <p className="text-xl font-bold text-stone-900">{org?.plan || 'Starter'}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-4">Team Members</p>
          <p className="text-stone-900">{org?.memberCount || 1} member</p>
          <button className="mt-4 px-4 py-2 border border-stone-200 rounded-lg text-stone-900 hover:bg-stone-50 text-sm font-semibold">
            Invite Team Member
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
