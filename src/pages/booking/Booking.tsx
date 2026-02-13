import { useSearchParams } from 'react-router';
import { InlineWidget } from 'react-calendly';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Smartphone, LineChart, HelpCircle } from 'lucide-react';

// --- CONFIGURATION ---
// Replace these with your ACTUAL Calendly event type URLs
const CALENDLY_CONFIG = {
  strategy: {
    url: "https://calendly.com/epaphrasagyapong1/enterprise-grc-strategy",
    title: "Enterprise GRC Strategy",
    description: "Deep dive into your risk architecture. We'll map out a migration plan from manual processes to automated GRC workflows.",
    icon: <LineChart className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-50 border-blue-200"
  },
  mvp: {
    url: "https://calendly.com/your-username/mvp-discovery",
    title: "MVP Development Discovery",
    description: "Technical feasibility assessment for your mobile app idea. We'll discuss architecture, budget, and go-to-market timeline.",
    icon: <Smartphone className="w-6 h-6 text-emerald-600" />,
    color: "bg-emerald-50 border-emerald-200"
  },
  retainer: {
    url: "https://calendly.com/your-username/fractional-po-intro",
    title: "Fractional Product Leadership",
    description: "Discuss ongoing product management support. Perfect for startups needing a part-time CPO to manage backlog and sprints.",
    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
    color: "bg-purple-50 border-purple-200"
  },
  // Default fallback
  intro: {
    url: "https://calendly.com/your-username/30min-intro",
    title: "General Inquiry",
    description: "Not sure where to start? Let's have a quick chat to see if we're a good fit for your project.",
    icon: <HelpCircle className="w-6 h-6 text-stone-600" />,
    color: "bg-stone-50 border-stone-200"
  }
};

const Booking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Get 'type' from URL (e.g. /booking?type=mvp) or default to 'intro'
  const activeType = searchParams.get('type') || 'intro';

  // Safe check to ensure valid type
  const configKey = Object.keys(CALENDLY_CONFIG).includes(activeType) ? activeType : 'intro';
  const currentConfig = CALENDLY_CONFIG[configKey as keyof typeof CALENDLY_CONFIG];

  // Helper to switch tabs
  const handleTypeChange = (newType: string) => {
    setSearchParams({ type: newType });
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN: Context & Value Prop */}
        <div className="lg:col-span-4 space-y-8">

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-stone-900">Schedule a Meeting</h1>
            <p className="text-stone-600 text-lg leading-relaxed">
              Select a meeting type to view my availability. All sessions include a follow-up email with actionable next steps.
            </p>
          </div>

          {/* Service Selector Tabs */}
          <div className="flex flex-col gap-3">
            {Object.entries(CALENDLY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleTypeChange(key)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${activeType === key
                    ? `${config.color} border-current shadow-sm`
                    : 'bg-white border-transparent hover:bg-stone-100 text-stone-500'
                  }`}
              >
                <div className={`mt-1 p-2 rounded-lg bg-white/50 ${activeType === key ? 'shadow-sm' : ''}`}>
                  {config.icon}
                </div>
                <div>
                  <h3 className={`font-bold ${activeType === key ? 'text-stone-900' : 'text-stone-700'}`}>
                    {config.title}
                  </h3>
                  {activeType === key && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-stone-600 mt-2 leading-relaxed"
                    >
                      {config.description}
                    </motion.p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* "What to Expect" Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <h4 className="font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs">What happens next?</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-stone-600">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>You'll receive a calendar invite with a Zoom/Google Meet link.</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-600">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>I'll review any materials you attach (decks, requirements) before the call.</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-600">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>If we're a good fit, I'll send a proposal within 24 hours.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* RIGHT COLUMN: The Widget */}
        <div className="lg:col-span-8">
          <motion.div
            key={currentConfig.url} // Forces re-render on URL change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200 h-[800px]"
          >
            <InlineWidget
              url={currentConfig.url}
              styles={{ height: '100%', width: '100%' }}
              prefill={{
                // Optional: Prefill custom answers if you passed them via state
                name: '',
                email: '',
                customAnswers: {
                  a1: activeType === 'mvp' ? 'I am interested in App Development' : 'I am interested in Strategy'
                }
              }}
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Booking;