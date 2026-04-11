import { CheckCircle2, X } from 'lucide-react';

const fits = [
  'Series A–C SaaS companies that have engineers but no senior product ownership',
  'Financial institutions and banks navigating GRC platform upgrades or compliance mandates',
  'Startups with a validated idea that need a technical co-pilot to get from prototype to App Store',
  'Organizations exploring AI adoption who need assessment + implementation, not just a strategy deck',
  'Mission-driven organizations that demand enterprise-grade delivery without enterprise-scale bureaucracy',
];

const notFits = [
  'Projects with no defined problem — "we want an app" is not a brief',
  'Engagements where the decision-maker won\'t be involved in the first call',
  'Scope-undefined retainers — every engagement starts with a written SOW',
  'Teams looking for a yes-person; I ask hard questions early',
];

const WhoIWorkWith = () => {
  return (
    <section className="py-24 bg-stone-900 w-full">
      <div className="w-full px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Who I Work Best With</h2>
            <p className="text-stone-400 text-xl max-w-2xl mx-auto">
              Knowing whether we're a good fit saves both of us time. Here's the honest version.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="bg-stone-800/60 border border-stone-700/50 rounded-3xl p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Great fit</h3>
              </div>
              <ul className="space-y-5">
                {fits.map(item => (
                  <li key={item} className="flex items-start gap-3 text-stone-300 leading-relaxed">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-800/40 border border-stone-700/30 rounded-3xl p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center text-stone-400 shrink-0">
                  <X size={20} />
                </div>
                <h3 className="text-xl font-bold text-stone-400">Not the right fit</h3>
              </div>
              <ul className="space-y-5">
                {notFits.map(item => (
                  <li key={item} className="flex items-start gap-3 text-stone-500 leading-relaxed">
                    <X size={16} className="text-stone-600 shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-stone-600 text-sm mt-8 pt-6 border-t border-stone-700/50">
                If you're not sure which side you're on, the free discovery call is exactly for that. No commitment, no pitch — just a straight conversation.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIWorkWith;
