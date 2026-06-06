import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '../../lib/supabase';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const type = searchParams.get('type');

        if (!code) {
          setError('No code provided');
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError || !data.session) {
          setError(exchangeError?.message || 'Failed to exchange code');
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        // Redirect based on type
        if (type === 'signup') {
          navigate('/portal/dashboard');
        } else {
          navigate('/portal/dashboard');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-900 font-semibold">Completing sign in...</p>
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
