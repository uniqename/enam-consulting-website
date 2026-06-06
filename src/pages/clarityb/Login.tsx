import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ClarityLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
      setError('Portal not configured yet.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setShake(s => s + 1);
      setPassword('');
    } else {
      navigate('/clarityb/portal/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 flex items-center justify-center px-6 pt-28 pb-24">
      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-3">
            <span className="text-lg font-bold text-stone-900">Doxa</span>
            <span className="text-lg font-bold text-emerald-600">ClarityHub</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Client Portal Login</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-stone-600 mb-2">
              Email
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                error
                  ? 'border-red-400 bg-red-50 placeholder-red-300'
                  : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'
              }`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-stone-600 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-10 ${
                  error
                    ? 'border-red-400 bg-red-50 placeholder-red-300'
                    : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'
                }`}
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

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          <button
            type="button"
            className="text-right text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-2"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-stone-900 hover:bg-emerald-700 disabled:bg-stone-400 text-white font-semibold py-3 rounded-xl text-sm transition-all mt-4"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-600">
          <p>Don't have an account?</p>
          <p className="mt-1">Contact your consultant to get access.</p>
        </div>
      </motion.div>
    </div>
  );
}
