import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Zap, CheckCircle2, ArrowRight, Clock, DollarSign } from 'lucide-react';

const deliverables = [
  'Clear product direction — what to build and why',
  'Prioritized roadmap your team can actually execute',
  'Business → technical translation so nothing gets lost',
  '90-day execution plan with milestones',
];

const ClaritySprint = () => {
  return (
    <section className="py-20 bg-stone-900 w-full relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-6 lg:px-16 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-400 text-sm font-bold tracking-wide">
              <Zap size={14} className="fill-emerald-400" />
              ENTRY POINT · FIRST 5 CLIENTS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                The Clarity<br />
                <span className="text-emerald-400">Sprint</span>
              </h2>
              <p className="text-stone-300 text-lg leading-relaxed mb-8">
                Most products stall not because of bad developers — but because business goals and engineering execution aren't aligned. I fix that in one week.
              </p>

              <ul className="space-y-3 mb-10">
                {deliverables.map(d => (
                  <li key={d} className="flex items-start gap-3 text-stone-300">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-6 items-center mb-10">
                <div className="flex items-center gap-2 text-white">
                  <Clock size={18} className="text-emerald-400" />
                  <span className="font-semibold">1 week turnaround</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <DollarSign size={18} className="text-emerald-400" />
                  <span className="font-bold text-2xl">$750</span>
                  <span className="text-stone-400 text-sm">· first 5 clients only</span>
                </div>
              </div>

              <Link
                to="/booking?type=strategy"
                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/40"
              >
                Book Your Clarity Sprint <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right — what the week looks like */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-stone-800/60 border border-stone-700/50 rounded-3xl p-8"
            >
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">What the week looks like</p>

              <div className="space-y-0">
                {[
                  { day: 'Day 1', title: 'Discovery Call', desc: 'We map exactly where you are, where you need to go, and what\'s in the way.' },
                  { day: 'Day 2–3', title: 'Diagnosis', desc: 'I audit your current thinking — roadmap, scope, team dynamics, and technical approach.' },
                  { day: 'Day 4', title: 'Translation', desc: 'I bridge the gap: convert business goals into engineering language your team can execute.' },
                  { day: 'Day 5', title: 'Delivery', desc: 'You get a clear direction document, prioritized roadmap, and 90-day execution plan.' },
                ].map((step, i, arr) => (
                  <div key={step.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-stone-700 my-1" />}
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{step.day}</span>
                        <span className="text-white font-semibold">{step.title}</span>
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-6 border-t border-stone-700/50">
                <p className="text-stone-400 text-xs italic">
                  Price increases to $2,500 after the first 5 engagements. No exceptions.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaritySprint;
