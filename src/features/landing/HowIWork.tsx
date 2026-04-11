import { Link } from 'react-router';
import { Search, FileText, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Search size={24} />,
    title: 'Discovery Call',
    subtitle: '30 min · Complimentary discovery',
    description:
      'We talk through your goals, current state, and constraints. I ask hard questions upfront — about timeline, budget, team, and what success actually looks like — so neither of us wastes time on a bad fit.',
    color: 'bg-stone-100 text-stone-700',
  },
  {
    number: '02',
    icon: <FileText size={24} />,
    title: 'Proposal & Scope',
    subtitle: 'Fixed scope · No surprises',
    description:
      'You get a written proposal with a clear scope, deliverables, timeline, and pricing. For fractional engagements: defined hours/week, sprint cadence, and what you can expect from me each month.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    number: '03',
    icon: <Rocket size={24} />,
    title: 'Embedded Delivery',
    subtitle: 'Inside your team',
    description:
      'I work alongside your team — not above it. Backlog grooming, sprint planning, stakeholder alignment, and technical coordination. If I\'m building, I write the code. If I\'m the PO, I own the backlog.',
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    number: '04',
    icon: <TrendingUp size={24} />,
    title: 'Ship & Measure',
    subtitle: 'Outcomes, not just outputs',
    description:
      'We define the metrics before we start, then track them. Every engagement ends with a clear record of what shipped, what moved, and what\'s next — whether that\'s a handoff or an extension.',
    color: 'bg-amber-50 text-amber-700',
  },
];

const HowIWork = () => {
  return (
    <section className="py-24 bg-white w-full border-t border-stone-100">
      <div className="w-full px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">How I Work</h2>
            <p className="text-stone-600 text-lg max-w-xl">
              No black-box consulting. Every engagement follows the same disciplined process — adapted to your context.
            </p>
          </div>
          <Link
            to="/booking"
            className="px-8 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shrink-0"
          >
            Start with a Free Call
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col p-8 rounded-2xl border border-stone-100 bg-stone-50 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color}`}>
                  {step.icon}
                </div>
                <span className="text-5xl font-bold text-stone-100 select-none">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-1">{step.title}</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-4">{step.subtitle}</p>
              <p className="text-stone-600 leading-relaxed text-sm grow">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-stone-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-lg mb-1">Typical engagement length: 4–16 weeks</p>
            <p className="text-stone-400 text-sm">Enterprise GRC transformations run longer. MVP builds are fixed-scope. Fractional PO is month-to-month.</p>
          </div>
          <Link
            to="/booking"
            className="px-8 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shrink-0"
          >
            Book a Free Discovery Call
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
