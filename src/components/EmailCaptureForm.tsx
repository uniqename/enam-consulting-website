import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface EmailCaptureFormProps {
  headline?: string;
  subheadline?: string;
  placeholder?: string;
  buttonText?: string;
  source?: string; // e.g., "landing-hero", "about-sidebar"
  onSuccess?: () => void;
}

export default function EmailCaptureForm({
  headline = 'Get Strategy Insights in Your Inbox',
  subheadline = 'Weekly tips on business operations, scaling, and systems thinking.',
  placeholder = 'your@email.com',
  buttonText = 'Subscribe',
  source = 'unknown',
  onSuccess,
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Add to Mailchimp
      const res = await fetch('/.netlify/functions/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to subscribe');
      }

      setSubmitted(true);
      setEmail('');

      if (onSuccess) {
        onSuccess();
      }

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-stone-900 mb-2">{headline}</h3>
          <p className="text-sm text-stone-600">{subheadline}</p>
        </div>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 py-4 text-emerald-600">
            <Check size={20} />
            <span className="font-medium">Thanks! Check your email.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? 'Subscribing...' : buttonText}
            </button>

            <p className="text-xs text-stone-500 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
