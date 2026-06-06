import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AssessmentState {
  step: 1 | 2 | 3 | 4 | 'result';
  companyName: string;
  industry: string;
  revenueRange: string;
  teamSize: string;
  challenges: string[];
  goals: string[];
  tools: string[];
  email: string;
  score?: number;
  tier?: string;
  breakdown?: Record<string, number>;
}

function calculateScore(state: Omit<AssessmentState, 'step' | 'score' | 'tier' | 'breakdown'>) {
  let score = 70;

  const challengePenalty = state.challenges.length * 5;
  score -= challengePenalty;

  const goodTools = ['quickbooks', 'freshbooks', 'xero', 'crm', 'hubspot', 'salesforce', 'projectmgmt', 'asana', 'trello', 'monday'];
  const toolBoost = state.tools.filter(t => goodTools.some(gt => t.toLowerCase().includes(gt))).length * 5;
  score += toolBoost;

  if (state.tools.some(t => t.toLowerCase().includes('no tools') || t.toLowerCase().includes('none'))) {
    score -= 15;
  }

  const goalBoost = Math.min(state.goals.length * 3, 15);
  score += goalBoost;

  score = Math.max(0, Math.min(100, score));

  const tier = score <= 40 ? 'Critical'
    : score <= 60 ? 'Needs Work'
    : score <= 80 ? 'Good Foundation'
    : 'Optimized';

  const breakdown = {
    operations: Math.max(0, 100 - (state.challenges.some(c => c.includes('Operations')) ? 30 : 0)),
    finance: Math.max(0, 100 - (state.challenges.some(c => c.includes('Cash Flow')) ? 30 : 0)),
    systems: toolBoost > 5 ? 75 : 40,
    team: Math.max(0, 100 - (state.challenges.some(c => c.includes('Staffing')) ? 25 : 0)),
  };

  return { score, tier, breakdown };
}

const challengeOptions = [
  'Sales & Revenue Growth',
  'Operations & Process',
  'Technology & Systems',
  'Staffing & HR',
  'Cash Flow & Finance',
  'Customer Retention',
  'Marketing & Branding',
  'Regulatory & Compliance',
];

const goalOptions = [
  'Increase Revenue 20%+',
  'Improve Profitability',
  'Operational Efficiency',
  'Build Systems & SOPs',
  'Scale the Team',
  'Expand to New Markets',
  'Prepare for Investment/Exit',
];

const toolOptions = [
  'QuickBooks / FreshBooks / Xero',
  'Excel / Google Sheets (manual)',
  'Slack / Teams',
  'CRM (HubSpot, Salesforce, etc.)',
  'Project Management (Asana, Trello, Monday)',
  'No formal tools',
  'Custom/Other',
];

export default function Assessment() {
  const [state, setState] = useState<AssessmentState>({
    step: 1,
    companyName: '',
    industry: '',
    revenueRange: '',
    teamSize: '',
    challenges: [],
    goals: [],
    tools: [],
    email: '',
  });

  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (typeof state.step === 'number') {
      if (state.step < 4) {
        setState(prev => ({ ...prev, step: (prev.step as number + 1) as any }));
      } else if (state.step === 4) {
        const { score, tier, breakdown } = calculateScore(state);
        setState(prev => ({
          ...prev,
          step: 'result',
          score,
          tier,
          breakdown,
        }));
      }
    }
  };

  const handlePrevious = () => {
    if (state.step === 'result') {
      setState(prev => ({ ...prev, step: 4 }));
    } else if (typeof state.step === 'number' && state.step > 1) {
      setState(prev => ({ ...prev, step: (prev.step as number - 1) as any }));
    }
  };

  const toggleChallenge = (challenge: string) => {
    setState(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge],
    }));
  };

  const toggleGoal = (goal: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const toggleTool = (tool: string) => {
    setState(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const handleSaveEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.email || !supabase) return;

    setSaving(true);
    try {
      await supabase.from('assessment_responses').insert({
        company_name: state.companyName,
        industry: state.industry,
        revenue_range: state.revenueRange,
        team_size: state.teamSize,
        challenges: state.challenges,
        goals: state.goals,
        tools: state.tools,
        score: state.score,
        tier: state.tier,
        breakdown: state.breakdown,
        email: state.email,
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
    setSaving(false);
  };

  const canProgress = state.step === 1
    ? state.companyName && state.industry && state.revenueRange && state.teamSize
    : state.step === 2
      ? state.challenges.length > 0
      : state.step === 3
        ? state.goals.length > 0
        : true;

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        {state.step !== 'result' && (
          <>
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4].map(step => {
                  const currentStep = typeof state.step === 'number' ? state.step : 0;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        if (step < currentStep) {
                          setState(prev => ({ ...prev, step: step as any }));
                        }
                      }}
                      className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-all ${
                        step < currentStep
                          ? 'bg-emerald-600 text-white cursor-pointer'
                          : step === currentStep
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {step}
                    </button>
                  );
                })}
              </div>
              <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((state.step as number) / 4) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Company Info */}
          {state.step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-stone-100 p-8"
            >
              <h2 className="text-2xl font-bold text-stone-900 mb-8">Company Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={state.companyName}
                    onChange={(e) => setState(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter your company name"
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Industry</label>
                  <select
                    value={state.industry}
                    onChange={(e) => setState(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select an industry</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="construction">Construction</option>
                    <option value="food">Food & Beverage</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Revenue Range</label>
                  <select
                    value={state.revenueRange}
                    onChange={(e) => setState(prev => ({ ...prev, revenueRange: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select a range</option>
                    <option value="under500k">Under $500K</option>
                    <option value="500k-1m">$500K to $1M</option>
                    <option value="1m-5m">$1M to $5M</option>
                    <option value="5m-25m">$5M to $25M</option>
                    <option value="over25m">$25M+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Team Size</label>
                  <select
                    value={state.teamSize}
                    onChange={(e) => setState(prev => ({ ...prev, teamSize: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select team size</option>
                    <option value="1-5">1 to 5</option>
                    <option value="6-15">6 to 15</option>
                    <option value="16-50">16 to 50</option>
                    <option value="51-200">51 to 200</option>
                    <option value="over200">200+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Challenges */}
          {state.step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-stone-100 p-8"
            >
              <h2 className="text-2xl font-bold text-stone-900 mb-2">What challenges are you facing?</h2>
              <p className="text-stone-600 mb-8">Select all that apply</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {challengeOptions.map(challenge => (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => toggleChallenge(challenge)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
                      state.challenges.includes(challenge)
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-200 text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {challenge}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Goals */}
          {state.step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-stone-100 p-8"
            >
              <h2 className="text-2xl font-bold text-stone-900 mb-2">What are your goals?</h2>
              <p className="text-stone-600 mb-8">Select all that apply</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goalOptions.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
                      state.goals.includes(goal)
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-200 text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Tools */}
          {state.step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-stone-100 p-8"
            >
              <h2 className="text-2xl font-bold text-stone-900 mb-2">What tools do you currently use?</h2>
              <p className="text-stone-600 mb-8">Select all that apply</p>
              <div className="space-y-4 mb-8">
                {toolOptions.map(tool => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
                      state.tools.includes(tool)
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-200 text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-6">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Email (optional)</label>
                <p className="text-xs text-stone-500 mb-3">Get your full report by email</p>
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* Result */}
          {state.step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Score Display */}
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">Your Business Health Score</p>
                <div className="flex justify-center mb-8">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e7e5e4" strokeWidth="6" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="6"
                        strokeDasharray={`${((state.score || 0) / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-4xl font-bold fill-stone-900">
                        {state.score}
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mb-6">
                  <span className={`px-4 py-2 rounded-full font-semibold text-white text-sm ${
                    state.tier === 'Critical' ? 'bg-red-600'
                      : state.tier === 'Needs Work' ? 'bg-amber-600'
                        : state.tier === 'Good Foundation' ? 'bg-emerald-600'
                          : 'bg-teal-600'
                  }`}>
                    {state.tier}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-2xl border border-stone-100 p-8">
                <h3 className="font-semibold text-stone-900 mb-6">Score Breakdown</h3>
                <div className="space-y-6">
                  {state.breakdown && Object.entries(state.breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-stone-900 capitalize">{key}</span>
                        <span className="text-sm font-semibold text-stone-600">{Math.round(value)}</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Email Form */}
              {state.email ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <p className="text-emerald-900 font-semibold">Assessment saved! Check {state.email} for your full report.</p>
                </div>
              ) : (
                <form onSubmit={handleSaveEmail} className="bg-white rounded-2xl border border-stone-100 p-8">
                  <h3 className="font-semibold text-stone-900 mb-4">Save your results</h3>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={state.email}
                      onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-3 rounded-lg border border-stone-200 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!state.email || saving}
                      className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-semibold transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              )}

              {/* CTAs */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => window.location.href = 'https://calendar.google.com'}
                  className="flex-1 px-6 py-4 rounded-xl bg-stone-900 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Book Discovery Call <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {state.step !== 'result' && (
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={typeof state.step === 'number' && state.step === 1}
              className="flex-1 px-6 py-3 rounded-lg border border-stone-200 text-stone-900 font-semibold hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProgress}
              className="flex-1 px-6 py-3 rounded-lg bg-stone-900 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {typeof state.step === 'number' && state.step === 4 ? 'View Results' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {state.step === 'result' && (
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => setState({
                step: 1,
                companyName: '',
                industry: '',
                revenueRange: '',
                teamSize: '',
                challenges: [],
                goals: [],
                tools: [],
                email: '',
              })}
              className="flex-1 px-6 py-3 rounded-lg border border-stone-200 text-stone-900 font-semibold hover:bg-stone-100 transition-colors"
            >
              Take Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
