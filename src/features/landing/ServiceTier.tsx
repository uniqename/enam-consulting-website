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
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Enterprise GRC</h3>
            <p className="text-stone-600 mb-8 leading-relaxed grow">
              Transform manual risk processes into automated workflows. Expertise in Archer, Audit Management, and Risk Mitigation.
            </p>
            <ul className="space-y-3 mb-10 text-stone-600">
              {['Roadmap Development', 'Gap Analysis', 'Vendor Selection'].map((item) => (
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
            <h3 className="text-2xl font-bold text-white mb-4">MVP Development</h3>
            <p className="text-stone-300 mb-8 leading-relaxed grow">
              Turn your idea into a production-ready iOS/Android app. Full-cycle development from architecture to App Store submission.
            </p>
            <ul className="space-y-3 mb-10 text-stone-300">
              {['Cross-Platform (Flutter)', 'Rapid Prototyping', 'Scalable Architecture'].map((item) => (
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
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Fractional PO</h3>
            <p className="text-stone-600 mb-8 leading-relaxed grow">
              Senior product leadership for startups that aren't ready for a full-time CPO. Backlog management, sprint planning, and team alignment.
            </p>
            <ul className="space-y-3 mb-10 text-stone-600">
              {['Agile Transformation', 'Stakeholder Management', 'Technical Audit'].map((item) => (
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