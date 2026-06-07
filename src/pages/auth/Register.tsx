import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Step = 1 | 2;

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Organization
  const [orgName, setOrgName] = useState('');
  const [entityType, setEntityType] = useState('FOR_PROFIT');
  const [industry, setIndustry] = useState('');

  const validateStep1 = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!orgName || !entityType || !industry) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  const handleStep1 = async () => {
    setError('');
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleStep2 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!validateStep2()) return;
    await handleRegister(e);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign up user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setError('Sign up failed');
        setLoading(false);
        return;
      }

      // Call serverless function to create org and add user
      // Default to STARTER plan - admins can change later
      const response = await fetch('/.netlify/functions/auth/create-org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgName,
          entityType,
          industry,
          plan: 'STARTER',
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || 'Failed to create organization');
        setLoading(false);
        return;
      }

      // Org created. Now sign in with password to get session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Account created, but sign-in failed. Try logging in manually.');
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }

      // Redirect to portal
      navigate('/portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 flex items-center justify-center px-6 pt-28 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Get Started</h1>
          <p className="text-stone-600 text-sm mt-2">Step {step} of 2</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-emerald-600' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => {
                    setOrgName(e.target.value);
                    setError('');
                  }}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Organization Type
                </label>
                <select
                  value={entityType}
                  onChange={(e) => {
                    setEntityType(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="FOR_PROFIT">For-Profit</option>
                  <option value="NONPROFIT">Nonprofit</option>
                  <option value="GOVERNMENT">Government</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => {
                    setIndustry(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select industry</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Construction">Construction</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((step - 1) as Step)}
              className="flex-1 px-4 py-3 rounded-lg border border-stone-200 text-stone-900 hover:bg-stone-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleStep1}
              className="flex-1 px-4 py-3 rounded-lg bg-stone-900 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <form onSubmit={handleRegister} className="flex-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-stone-900 hover:bg-emerald-700 disabled:bg-stone-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
