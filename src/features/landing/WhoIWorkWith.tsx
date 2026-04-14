import { motion } from 'framer-motion';
import { Building2, TrendingUp, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils/animation';

const PROFILES = [
  {
    icon: <Building2 size={22} />,
    title: 'Financial Institutions',
    desc: 'Banks, fintechs, and regulated firms navigating compliance, GRC modernization, or digital transformation who need a PM who understands both the regulatory language and the engineering constraints.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Series A–C SaaS Companies',
    desc: 'Growth-stage product teams that need to scale delivery, clean up their roadmap, or hire a fractional PO to bridge strategy and engineering without adding a full-time headcount.',
  },
  {
    icon: <HeartHandshake size={22} />,
    title: 'Mission-Driven Organizations',
    desc: 'Nonprofits and impact-first ventures that need senior product leadership without the Fortune 500 overhead — teams building things that matter and need a builder who gets it.',
  },
];

const WhoIWorkWith = () => {
  return (
    <section id="who-i-work-with" className="py-24 bg-white w-full">
      <div className="w-full px-6 lg:px-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Ideal Client Profile</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-5">
            Who I work <span className="text-emerald-600">best with</span>
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl">
            I'm not the right fit for every engagement. Here's who gets the most value from working together — and why.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14"
        >
          {PROFILES.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              className="bg-stone-50 border border-stone-100 rounded-2xl p-8 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{p.title}</h3>
              <p className="text-stone-500 leading-relaxed text-base">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Not a fit callout */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-stone-900 rounded-2xl p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6"
        >
          <div className="flex-1">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Best fit summary</p>
            <p className="text-white text-lg font-medium leading-relaxed">
              Series A–C SaaS, financial institutions navigating compliance, and mission-driven orgs that need senior product leadership — without the full-time overhead.
            </p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {['Enterprise-grade delivery', 'GRC & regulated industries', 'Fractional or full-time'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-stone-300 text-sm">
                <CheckCircle2 size={15} className="text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoIWorkWith;
