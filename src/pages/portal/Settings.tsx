import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/auth/login');
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900">Settings</h1>

      <div className="mt-8 space-y-6">
        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-2">Organization</p>
          <p className="text-xl font-bold text-stone-900">Doxa & Co</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-2">Plan</p>
          <p className="text-xl font-bold text-stone-900">Starter</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6">
          <p className="text-xs uppercase font-semibold text-stone-600 mb-4">Team Members</p>
          <p className="text-stone-900">1 member</p>
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
