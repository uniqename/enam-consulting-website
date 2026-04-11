import { motion } from 'framer-motion';
import { Link } from 'react-router'; 
import { CheckCircle2, LineChart } from 'lucide-react';
import { fadeInUp } from '../../utils/animation';

const Hero = () => {
  return (
    <section id="hero" className="relative w-full flex items-center bg-stone-50 pt-20 min-h-[90vh]">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-100/50 rounded-bl-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-emerald-50 rounded-tr-full blur-3xl opacity-60 pointer-events-none" />

      <div className="w-full px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Available for Full-Time Roles &amp; Consulting Engagements
          </div>

          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-stone-900 leading-[1.1] mb-6">
            Enterprise Rigor. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-700">
              Startup Velocity.
            </span>
          </h1>

          <p className="text-xl text-stone-600 mb-3 leading-relaxed max-w-2xl">
            Senior Product Manager and developer who has shipped enterprise GRC platforms at Fortune 500 banks and built B2B SaaS products from 0→1 — including two live apps on the App Store.
          </p>
          <p className="text-base text-stone-500 mb-8 leading-relaxed max-w-2xl">
            Available full-time or as a Fractional PO — based in the US, working globally.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/booking"
              className="px-8 py-4 rounded-full bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-1"
            >
              Book a Strategy Call
            </Link>
            <Link to="projects">
            <button
              type="button"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 cursor-pointer rounded-full bg-white text-stone-900 border border-stone-200 font-semibold text-lg hover:bg-stone-50 transition-all"
              >
              View Case Studies
            </button>
              </Link>
            <Link
              to="/hire"
              className="px-8 py-4 rounded-full bg-transparent text-stone-500 border border-dashed border-stone-300 font-semibold text-base hover:bg-stone-50 hover:text-stone-700 hover:border-stone-400 transition-all"
            >
              For Employers →
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-stone-500">
            <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-600" /> PMP® Certified</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-600" /> Certified Scrum Master</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-600" /> MS Data Science</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative lg:flex flex-col items-center gap-8 w-full"
        >
          {/* Headshot */}
          <div className="relative flex flex-col items-center">
            <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-2 ring-emerald-200">
              <img
                src="/assets/images/enam-headshot.jpg"
                alt="Enam Egyir — Principal Consultant, Doxa & Co"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Enam Egyir · Principal Consultant
            </div>
          </div>

          {/* Metrics dashboard card */}
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl border border-stone-100 rotate-1 hover:rotate-0 transition-transform duration-500 max-w-xl w-full">
             <div className="flex items-center justify-between mb-8">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-yellow-400" />
                 <div className="w-3 h-3 rounded-full bg-green-400" />
               </div>
               <div className="text-xs font-mono text-stone-400">STATUS: DEPLOYED</div>
             </div>
             <div className="space-y-6">
               <div className="h-8 bg-stone-100 rounded w-3/4" />
               <div className="h-40 bg-emerald-50/50 rounded-xl border border-emerald-100 p-6 flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><LineChart size={20} /></div>
                   <span className="font-bold text-stone-700">Risk Reduction</span>
                 </div>
                 <div className="text-4xl font-bold text-stone-900">17% <span className="text-base font-normal text-stone-500 ml-2">via mitigation strategies</span></div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                   <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Efficiency</div>
                   <div className="text-2xl font-bold text-stone-900 mt-2">+30%</div>
                 </div>
                 <div className="bg-stone-50 rounded-xl p-5 border border-stone-100">
                   <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Process Time</div>
                   <div className="text-2xl font-bold text-stone-900 mt-2">-25%</div>
                 </div>
               </div>
             </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;