import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useMagicLink) {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (err) {
          setError(err.message);
        } else {
          setMagicSent(true);
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) {
          setError(err.message);
        } else {
          navigate('/portal/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (magicSent) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-stone-100 p-10 w-full max-w-sm text-center"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Check your email</h2>
          <p className="text-stone-600 text-sm mb-6">
            We sent a magic link to <strong>{email}</strong>. Click it to sign in.
          </p>
          <button
            onClick={() => setMagicSent(false)}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
          >
            ← Back to login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 flex items-center justify-center px-6 pt-28 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900">DoxaOS</h1>
          <p className="text-stone-600 text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all ${
                error
                  ? 'border-red-400 bg-red-50'
                  : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'
              }`}
              required
            />
          </div>

          {!useMagicLink && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all pr-10 ${
                    error
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-emerald-700 disabled:bg-stone-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader size={16} className="animate-spin" />}
            {useMagicLink ? 'Send Magic Link' : 'Sign In'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-stone-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setUseMagicLink(!useMagicLink);
              setPassword('');
              setError('');
            }}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold text-sm transition-colors"
          >
            {useMagicLink ? 'Use Password Instead' : 'Use Magic Link'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-600">
          <p>Don't have an account?</p>
          <Link to="/auth/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Sign up here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
