import { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const Healthcheck = () => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'thankyou'>('assessment');
  const [scores, setScores] = useState({
    strategy: 0,
    revenue: 0,
    operations: 0,
    marketing: 0,
    technology: 0,
    team: 0,
    customerExp: 0,
    financials: 0,
    brand: 0,
    vision: 0,
  });
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { key: 'strategy', label: '01 · STRATEGY', text: 'I have a clear, written 90-day plan for my business.' },
    { key: 'revenue', label: '02 · REVENUE', text: 'I know exactly where my revenue comes from and can predict it.' },
    { key: 'operations', label: '03 · OPERATIONS', text: 'My key business processes are documented and repeatable.' },
    { key: 'marketing', label: '04 · MARKETING', text: 'I consistently attract new clients without scrambling.' },
    { key: 'technology', label: '05 · TECHNOLOGY', text: 'The tools I use save me time rather than add to my workload.' },
    { key: 'team', label: '06 · TEAM / CAPACITY', text: 'I have the right support in place to grow without burnout.' },
    { key: 'customerExp', label: '07 · CUSTOMER EXPERIENCE', text: 'My clients consistently refer others to my business.' },
    { key: 'financials', label: '08 · FINANCIAL CLARITY', text: 'I review my finances monthly and understand my numbers.' },
    { key: 'brand', label: '09 · BRAND & VISIBILITY', text: 'My online presence clearly communicates what I do and for whom.' },
    { key: 'vision', label: '10 · VISION & DIRECTION', text: 'I feel confident and clear about where my business is headed.' },
  ];

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScore = (key: string, value: number) => {
    setScores({ ...scores, [key]: value });
  };

  const getResultCategory = (total: number) => {
    if (total >= 24) return { range: '24–30', label: 'Growth-ready', desc: 'Optimize and scale.' };
    if (total >= 17) return { range: '17–23', label: 'Building momentum', desc: 'Consistency gaps cost you.' };
    return { range: '10–16', label: 'Foundation gaps', desc: 'Fix before scaling.' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/.netlify/functions/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scores,
          total,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setActiveTab('thankyou');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    }
  };

  const result = getResultCategory(total);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-emerald-600"></div>
            <h1 className="text-4xl font-bold text-slate-900">Business Health Assessment</h1>
          </div>
          <p className="text-lg text-slate-600">
            10 questions. 2 minutes. See exactly where your business needs attention.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        {activeTab === 'assessment' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <p className="text-blue-900">
                <strong>How to score:</strong> circle the number that best reflects where you are today.
              </p>
              <div className="mt-3 space-y-1 text-sm text-blue-800">
                <p><strong>1</strong> = Needs urgent attention</p>
                <p><strong>2</strong> = In progress / inconsistent</p>
                <p><strong>3</strong> = Strong and working</p>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((q) => (
                <div key={q.key} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-emerald-600 mb-2">{q.label}</label>
                  <p className="text-slate-900 font-medium mb-4">{q.text}</p>
                  <div className="flex gap-3">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleScore(q.key, num)}
                        className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                          scores[q.key as keyof typeof scores] === num
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 text-slate-600 hover:border-emerald-600'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Score Summary */}
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-lg">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">{total}</div>
                  <div className="text-sm text-emerald-700">Your score</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-900">{result.range}</div>
                  <div className="text-sm text-emerald-700">Score range</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-900">{result.label}</div>
                  <div className="text-sm text-emerald-700">Status</div>
                </div>
              </div>
              <p className="text-emerald-900 font-medium">{result.desc}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900">Get Your Personalized Results Key</h3>
              <p className="text-slate-600 text-sm">
                Leave your details and we'll email your personalized results breakdown within 48 hours.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Get My Results Key
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="text-center text-sm text-slate-500">
              We respect your privacy. Your data will only be used to send your results.
            </div>
          </form>
        )}

        {activeTab === 'thankyou' && (
          <div className="text-center py-12">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Assessment Submitted</h2>
            <p className="text-lg text-slate-600 mb-6">
              Thanks, {formData.name}! Check your email (<strong>{formData.email}</strong>) within 48 hours for your personalized results breakdown.
            </p>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-semibold text-slate-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">→</span>
                  <span>Review your personalized results key when it arrives</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">→</span>
                  <span>Identify your lowest-scoring areas (the biggest opportunities)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">→</span>
                  <span>
                    <a href="/booking" className="text-emerald-600 hover:underline font-semibold">
                      Book a free 30-minute strategy session
                    </a>
                    {' '}to create a plan
                  </span>
                </li>
              </ul>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Back to Home
              <ArrowRight size={20} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Healthcheck;
