import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { LineChart, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, Code2 } from 'lucide-react';

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
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
              Turn your idea into a production-ready iOS/Android app. I own the product decisions and write the code — so you ship faster with fewer middlemen.
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
      </div>
    </section>
  );
};

export default Services;