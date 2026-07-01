import { useState } from 'react';
import { CheckCircle2, ArrowRight, FileText, CheckSquare, Lightbulb, Home, ChevronLeft } from 'lucide-react';

const Healthcheck = () => {
  const [currentPage, setCurrentPage] = useState<'hub' | 'clarity' | 'quickwins' | 'assessment' | 'pm' | 'thankyou'>('hub');
  const [formData, setFormData] = useState({ name: '', businessName: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  // ============ HUB PAGE ============
  const HubPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Clarity Before Strategy</h1>
          <p className="text-xl text-slate-600">
            Choose the assessment that fits where you are right now.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 1. Clarity */}
          <button
            type="button"
            onClick={() => setCurrentPage('clarity')}
            className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-emerald-600 cursor-pointer transition-all hover:shadow-lg text-left w-full"
          >
            <div className="flex items-start gap-4 mb-4">
              <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Clarity Before Strategy</h3>
                <p className="text-sm text-slate-500 mt-1">3 questions • 5 minutes</p>
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              Answer 3 honest questions to reveal the real goal hiding behind your biggest problem.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              Start <ArrowRight size={20} />
            </div>
          </button>

          {/* 2. Quick Wins */}
          <button
            type="button"
            onClick={() => setCurrentPage('quickwins')}
            className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-emerald-600 cursor-pointer transition-all hover:shadow-lg text-left w-full"
          >
            <div className="flex items-start gap-4 mb-4">
              <Lightbulb className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">5 Quick Wins</h3>
                <p className="text-sm text-slate-500 mt-1">5 items • 5 minutes</p>
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              5 practical improvements you can start this week — no budget required.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              Start <ArrowRight size={20} />
            </div>
          </button>

          {/* 3. Business Health */}
          <button
            type="button"
            onClick={() => setCurrentPage('assessment')}
            className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-emerald-600 cursor-pointer transition-all hover:shadow-lg text-left w-full"
          >
            <div className="flex items-start gap-4 mb-4">
              <CheckSquare className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Business Health Assessment</h3>
                <p className="text-sm text-slate-500 mt-1">10 questions • 5 minutes</p>
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              Score yourself across 10 dimensions. See exactly where your business needs attention.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              Start <ArrowRight size={20} />
            </div>
          </button>

          {/* 4. Property Management */}
          <button
            type="button"
            onClick={() => setCurrentPage('pm')}
            className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-emerald-600 cursor-pointer transition-all hover:shadow-lg text-left w-full"
          >
            <div className="flex items-start gap-4 mb-4">
              <Home className="w-8 h-8 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">5 Systems Framework</h3>
                <p className="text-sm text-slate-500 mt-1">5 questions • 5 minutes</p>
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              For property managers: The 5 systems that break the moment you step away.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
              Start <ArrowRight size={20} />
            </div>
          </button>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
          <p className="text-blue-900">
            <strong>Pro tip:</strong> Start with "Clarity Before Strategy" to identify your real goal, then choose the assessment that matches your business type.
          </p>
        </div>
      </div>
    </div>
  );

  // ============ CLARITY BEFORE STRATEGY ============
  const ClarityPage = () => {
    const [clarityAnswers, setClarityAnswers] = useState({
      q1: '',
      q2: '',
      q3: '',
    });

    const handleClaritySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await fetch('/.netlify/functions/submit-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'clarity',
            ...formData,
            answers: clarityAnswers,
            timestamp: new Date().toISOString(),
          }),
        });
        setSubmitted(true);
        setCurrentPage('thankyou');
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => setCurrentPage('hub')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Clarity Before Strategy</h1>
            <p className="text-lg text-slate-600">
              Before you can build the right plan, you need to see clearly where you are.
            </p>
          </div>

          <form onSubmit={handleClaritySubmit} className="space-y-8">
            {/* Questions */}
            {[
              {
                num: '01',
                question: 'What is the ONE thing in your business that is consistently draining your time, energy, or revenue right now?',
                hint: 'Be specific. Not "everything" — pick the loudest one.',
                key: 'q1',
              },
              {
                num: '02',
                question: 'If that problem disappeared tomorrow, what would you be able to do that you cannot do today?',
                hint: 'This is your real goal. The problem is just in the way.',
                key: 'q2',
              },
              {
                num: '03',
                question: 'What have you already tried, and why do you think it has not fully worked yet?',
                hint: 'Honesty here is where the breakthrough lives.',
                key: 'q3',
              },
            ].map((q) => (
              <div key={q.key} className="bg-white p-6 rounded-lg border border-slate-200">
                <label className="block text-sm font-semibold text-emerald-600 mb-2">
                  QUESTION {q.num}
                </label>
                <p className="text-lg font-medium text-slate-900 mb-2">{q.question}</p>
                <p className="text-sm text-slate-500 mb-4 italic">{q.hint}</p>
                <textarea
                  required
                  value={clarityAnswers[q.key as keyof typeof clarityAnswers]}
                  onChange={(e) => setClarityAnswers({ ...clarityAnswers, [q.key]: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  rows={4}
                  placeholder="Your answer here..."
                />
              </div>
            ))}

            {/* Contact Info */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900">Your Contact Information</h3>
              <input
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                required
                placeholder="Business name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg"
              >
                Submit Answers
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============ 5 QUICK WINS ============
  const QuickWinsPage = () => {
    const [wins, setWins] = useState({
      w1: false,
      w2: false,
      w3: false,
      w4: false,
      w5: false,
    });

    const handleQuickWinsSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await fetch('/.netlify/functions/submit-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'quickwins',
            ...formData,
            completed: Object.values(wins).filter(Boolean).length,
            wins,
            timestamp: new Date().toISOString(),
          }),
        });
        setSubmitted(true);
        setCurrentPage('thankyou');
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting. Please try again.');
      }
    };

    const quickWins = [
      { key: 'w1', title: 'Document Your #1 Repeated Process', desc: 'Pick the task you or your team does most often. Write it down step-by-step.' },
      { key: 'w2', title: 'Audit Your Customer Follow-Up', desc: 'Set a 24-hour response standard and create a simple email template.' },
      { key: 'w3', title: 'Clean Up Your Google Business Profile', desc: 'Verify your hours, photos, and contact info are current.' },
      { key: 'w4', title: 'Identify Your Top 3 Revenue Drivers', desc: 'Which 3 services bring in the most income?' },
      { key: 'w5', title: 'Schedule One Strategic Hour Per Week', desc: 'Block one hour weekly to work ON your business, not in it.' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => setCurrentPage('hub')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">5 Quick Wins for Your Small Business</h1>
            <p className="text-lg text-slate-600">
              Practical improvements you can start this week — no budget required.
            </p>
          </div>

          <form onSubmit={handleQuickWinsSubmit} className="space-y-8">
            {quickWins.map((win, idx) => (
              <div key={win.key} className="bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    checked={wins[win.key as keyof typeof wins]}
                    onChange={(e) => setWins({ ...wins, [win.key]: e.target.checked })}
                    className="w-6 h-6 rounded cursor-pointer mt-1"
                  />
                  <div>
                    <div className="text-sm font-bold text-emerald-600 mb-1">{idx + 1}</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{win.title}</h3>
                    <p className="text-slate-600">{win.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Info */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900">Your Contact Information</h3>
              <input type="text" required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <input type="text" required placeholder="Business name" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <input type="email" required placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============ BUSINESS HEALTH ASSESSMENT (Original) ============
  const AssessmentPage = () => {
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

    const total = Object.values(scores).reduce((a, b) => a + b, 0);

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

    const getResultCategory = (total: number) => {
      if (total >= 24) return { range: '24–30', label: 'Growth-ready', desc: 'Optimize and scale.' };
      if (total >= 17) return { range: '17–23', label: 'Building momentum', desc: 'Consistency gaps cost you.' };
      return { range: '10–16', label: 'Foundation gaps', desc: 'Fix before scaling.' };
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await fetch('/.netlify/functions/submit-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'assessment',
            ...formData,
            scores,
            total,
            timestamp: new Date().toISOString(),
          }),
        });
        setSubmitted(true);
        setCurrentPage('thankyou');
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting. Please try again.');
      }
    };

    const result = getResultCategory(total);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => setCurrentPage('hub')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Health Assessment</h1>
          <p className="text-lg text-slate-600 mb-8">10 questions. 2 minutes. See exactly where your business needs attention.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((q) => (
                <div key={q.key} className="bg-white p-6 rounded-lg border border-slate-200">
                  <label className="block text-sm font-semibold text-emerald-600 mb-2">{q.label}</label>
                  <p className="text-slate-900 font-medium mb-4">{q.text}</p>
                  <div className="flex gap-3">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setScores({ ...scores, [q.key]: num })}
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

            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-lg">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">{total}</div>
                  <div className="text-sm text-emerald-700">Your score</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-900">{result.label}</div>
                  <div className="text-sm text-emerald-700">Status</div>
                </div>
              </div>
              <p className="text-emerald-900 font-medium">{result.desc}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900">Your Contact Information</h3>
              <input type="text" required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <input type="text" required placeholder="Business name" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <input type="email" required placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg">
                Get My Results
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============ PROPERTY MANAGEMENT (5 SYSTEMS) ============
  const PMPage = () => {
    const [pmAnswers, setPMAnswers] = useState({
      priority: '',
      notes: '',
    });

    const systems = [
      'Maintenance & work orders live in your head',
      'Vendor coordination has no paper trail',
      'Turnover starts from scratch every time',
      'Nothing is written down for your team',
      "You're busy, but you can't see what's working",
    ];

    const handlePMSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await fetch('/.netlify/functions/submit-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pm',
            ...formData,
            ...pmAnswers,
            timestamp: new Date().toISOString(),
          }),
        });
        setSubmitted(true);
        setCurrentPage('thankyou');
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => setCurrentPage('hub')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">The 5 Systems That Break</h1>
            <p className="text-lg text-slate-600">
              The moment you step away: Where property management businesses quietly lose margin.
            </p>
          </div>

          <form onSubmit={handlePMSubmit} className="space-y-6">
            <div className="space-y-4">
              {systems.map((system, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-slate-200">
                  <div className="flex gap-4">
                    <div className="text-2xl font-bold text-orange-600 w-8 flex-shrink-0">{idx + 1}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{system}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-4">Reflection</h3>
              <p className="text-blue-900 mb-4">
                If you stepped away for two weeks, which of these five would fall apart first?
              </p>
              <textarea
                value={pmAnswers.priority}
                onChange={(e) => setPMAnswers({ ...pmAnswers, priority: e.target.value })}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg"
                rows={3}
                placeholder="Your answer..."
              />
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900">Your Contact Information</h3>
              <input type="text" required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <input type="text" required placeholder="Business name" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <input type="email" required placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============ THANK YOU PAGE ============
  const ThankYouPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Assessment Submitted!</h2>
          <p className="text-lg text-slate-600">
            Thanks, {formData.name}. We'll review your responses and reach out within 48 hours.
          </p>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-lg mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">What Happens Next?</h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold text-lg">→</span>
              <span>We'll email your personalized insights to <strong>{formData.email}</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold text-lg">→</span>
              <span>Review where you stand and identify your biggest opportunity</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600 font-bold text-lg">→</span>
              <span>Book a free 30-minute strategy call to create a plan</span>
            </li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <a
            href="/booking"
            className="block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg text-center transition-colors"
          >
            Book a Free Clarity Call
            <div className="text-sm font-normal mt-1">30 minutes • No obligation</div>
          </a>
          <button
            type="button"
            onClick={() => {
              setCurrentPage('hub');
              setFormData({ name: '', businessName: '', email: '' });
            }}
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Back to Assessments
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
          <p className="text-blue-900 text-sm">
            <strong>Already know what you want to work on?</strong><br />
            Skip the wait and{' '}
            <a href="/booking" className="font-bold text-blue-700 hover:underline">
              schedule a call now
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  // ============ RENDER ============
  return (
    <>
      {currentPage === 'hub' && <HubPage />}
      {currentPage === 'clarity' && <ClarityPage />}
      {currentPage === 'quickwins' && <QuickWinsPage />}
      {currentPage === 'assessment' && <AssessmentPage />}
      {currentPage === 'pm' && <PMPage />}
      {currentPage === 'thankyou' && <ThankYouPage />}
    </>
  );
};

export default Healthcheck;
