import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { LineChart, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, Code2, Bot, TrendingUp } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white w-full">
      <div className="w-full px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6">Strategic Consulting Services</h2>
          <p className="text-stone-600 text-xl">
            Practical, budget-conscious technology guidance backed by real-world implementation experience.
          </p>
        </div>

        {/* Top 3 services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 mb-8">
          <motion.div whileHover={{ y: -5 }} className="flex flex-col p-10 rounded-3xl bg-stone-50 border border-stone-100 hover:border-emerald-200 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-8">
              <LineChart size={28} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-1">Enterprise GRC</h3>
            <p className="text-emerald-700 text-sm font-bold mb-4">Starting at $8,000 / engagement</p>
            <p className="text-stone-600 mb-8 leading-relaxed grow">
              Transform manual risk processes into automated, auditable workflows. 10+ years of Archer GRC experience across Fortune 500 banks — I know where projects go wrong.
            </p>
            <ul className="space-y-3 mb-10 text-stone-600">
              {['Roadmap & Gap Analysis', 'Backlog Ownership & Sprint Delivery', 'Executive Reporting & Metrics'].map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle2 size={20} className="text-emerald-600 shrink-0" /> {item}</li>
              ))}
            </ul>
            <Link to="/booking?type=strategy" className="mt-auto flex items-center text-emerald-700 font-bold hover:gap-3 transition-all">
              Book Strategy Session <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col p-10 rounded-3xl bg-stone-900 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Code2 size={150} /></div>
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-8">
              <Smartphone size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">MVP Development</h3>
            <p className="text-emerald-400 text-sm font-bold mb-4">Starting at $15,000 · 8–16 weeks</p>
            <p className="text-stone-300 mb-8 leading-relaxed grow">
              Turn your idea into a production-ready iOS/Android app. I own the product decisions and direct the build — so you ship faster with fewer middlemen.
            </p>
            <ul className="space-y-3 mb-10 text-stone-300">
              {['Discovery → Backlog → App Store', 'Cross-Platform (Flutter)', 'Fixed-scope, milestone billing'].map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle2 size={20} className="text-emerald-400 shrink-0" /> {item}</li>
              ))}
            </ul>
            <Link to="/booking?type=mvp" className="mt-auto flex items-center text-white font-bold hover:gap-3 transition-all">
              Start Your Project <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col p-10 rounded-3xl bg-stone-50 border border-stone-100 hover:border-emerald-200 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mb-8">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-1">Fractional PO</h3>
            <p className="text-emerald-700 text-sm font-bold mb-4">Starting at $4,500 / month · 10–15 hrs/week</p>
            <p className="text-stone-600 mb-8 leading-relaxed grow">
              Senior product leadership without the full-time cost. I embed with your team on a monthly retainer — owning the backlog, running sprints, and keeping engineering aligned with business goals.
            </p>
            <ul className="space-y-3 mb-10 text-stone-600">
              {['Weekly sprint planning & reviews', 'Backlog ownership & roadmap', 'Stakeholder reporting & OKRs'].map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle2 size={20} className="text-emerald-600 shrink-0" /> {item}</li>
              ))}
            </ul>
            <Link to="/booking?type=retainer" className="mt-auto flex items-center text-emerald-700 font-bold hover:gap-3 transition-all">
              Inquire About Retainer <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* AI Advisory — full-width featured card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 shadow-xl p-10 lg:p-14"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Bot size={320} />
          </div>

          {/* NEW badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tracking-wider uppercase mb-6">
            New Service
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left: icon + title + description + edge */}
            <div className="lg:col-span-5 space-y-5">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-stone-900 mb-1">AI Transformation Advisory</h3>
                <p className="text-amber-700 text-sm font-bold mb-4">Audit from $3,500 · Build from $8,000 · Retainer from $5,500/mo</p>
              </div>
              <p className="text-stone-600 leading-relaxed text-lg">
                78% of businesses say AI is a priority — but only 23% have ever done a formal assessment. Most consultants hand you a strategy deck and leave. I assess, then <em>build the actual solution</em> — no handoff gap, no tools your team won't use.
              </p>

              {/* Competitive edge callouts */}
              <div className="space-y-2.5">
                {[
                  { label: 'Assessment + Implementation', sub: 'Most firms do one or the other. I do both.' },
                  { label: 'GRC & Compliance Depth', sub: '10+ years Fortune 500 banking — I catch regulatory risk AI consultants miss.' },
                  { label: 'Startup-ready pricing', sub: 'Big Four charges $35k–$100k. My entry point is $3,500.' },
                ].map(edge => (
                  <div key={edge.label} className="flex items-start gap-3">
                    <TrendingUp size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-bold text-stone-800">{edge.label}</span>
                      <span className="text-sm text-stone-500"> — {edge.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/booking?type=ai" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                Start with an AI Audit <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right: 3 service tiers */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">

              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-3">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tier 1</div>
                <h4 className="font-bold text-stone-900 text-lg">AI Readiness Audit</h4>
                <p className="text-stone-500 text-sm leading-relaxed">I map your operations, find the top 3–5 AI use cases, recommend the right tools, and deliver a 90-day action plan.</p>
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-sm font-bold text-stone-800">$3,500 – $5,000</p>
                  <p className="text-xs text-stone-400">One-time · 2–3 week engagement</p>
                </div>
                <ul className="space-y-1.5">
                  {['Operations & data gap analysis', 'Tool shortlist + ROI estimates', '90-day AI roadmap'].map(i => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-500">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-sm p-6 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tier 2</div>
                <h4 className="font-bold text-white text-lg">AI Build & Deploy</h4>
                <p className="text-stone-300 text-sm leading-relaxed">I build the actual solution — custom AI agents, automated workflows, analytics dashboards — and hand it off running.</p>
                <div className="pt-2 border-t border-stone-700">
                  <p className="text-sm font-bold text-white">$8,000 – $20,000</p>
                  <p className="text-xs text-stone-400">Per project · 4–10 weeks</p>
                </div>
                <ul className="space-y-1.5">
                  {['Custom AI agent or workflow', 'Tool integration & testing', 'Team handoff & training'].map(i => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-3">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Tier 3</div>
                <h4 className="font-bold text-stone-900 text-lg">Fractional AI Officer</h4>
                <p className="text-stone-500 text-sm leading-relaxed">Your on-call AI leader. I own your AI adoption strategy, manage vendors, train your team, and iterate month over month.</p>
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-sm font-bold text-stone-800">$5,500 – $7,500/mo</p>
                  <p className="text-xs text-stone-400">Monthly retainer · 3-month min</p>
                </div>
                <ul className="space-y-1.5">
                  {['Monthly AI strategy reviews', 'Vendor & tool management', 'Team training & adoption'].map(i => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-500">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
