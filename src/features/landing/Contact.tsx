import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

const services = [
  'Enterprise GRC Consulting',
  'MVP Development',
  'Fractional Product Owner',
  'AI Transformation Advisory',
  'General Inquiry',
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      // Submit to Netlify Forms
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });

      // Fire auto-reply emails via Resend (non-blocking — don't fail the submission if this errors)
      fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name') as string,
          email: data.get('email') as string,
          company: (data.get('company') as string) || '',
          service: (data.get('service') as string) || 'General Inquiry',
          message: data.get('message') as string,
        }),
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      window.location.href = `mailto:ename@doxaandco.co?subject=Inquiry from ${data.get('name')}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-stone-50 w-full">
      <div className="w-full px-6 lg:px-16 max-w-3xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4">Get in Touch</h2>
          <p className="text-stone-500 text-lg">
            Tell me what you're working on. I'll respond within one business day.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-4"
          >
            <CheckCircle2 size={56} className="text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-bold text-stone-900">Message Received</h3>
            <p className="text-stone-500">I'll be in touch within one business day at the email you provided.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-6 bg-white rounded-3xl p-10 shadow-sm border border-stone-100"
          >
            {/* Netlify hidden fields */}
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><input name="bot-field" aria-label="bot-field" /></p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-stone-900 placeholder:text-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">I'm interested in *</label>
                <select
                  name="service"
                  required
                  defaultValue=""
                  title="I'm interested in"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-stone-900 bg-white"
                >
                  <option value="" disabled>Select a service</option>
                  {services.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project, challenge, or question..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-stone-900 placeholder:text-stone-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-stone-900 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>

            <p className="text-center text-xs text-stone-400">
              Or email directly at{' '}
              <a href="mailto:ename@doxaandco.co" className="text-emerald-600 hover:underline">
                ename@doxaandco.co
              </a>
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default Contact;
