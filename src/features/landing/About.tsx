import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LineChart, Code2, LayoutList, Users, GitBranch, TrendingUp } from 'lucide-react';
import { staggerContainer } from '../../utils/animation';
import SignatureGenerator from './SignatureGenerator';

const About = () => {
  const [showSigGen, setShowSigGen] = useState(false);

  return (
    <section id="about" className="py-24 bg-stone-50 w-full relative">
      <div className="w-full px-6 lg:px-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-8">
              Most consultants only give advice. <br />
              <span className="text-emerald-600">I build the solution.</span>
            </h2>
            <div className="space-y-6 text-lg lg:text-xl text-stone-600 leading-relaxed max-w-2xl">
              <p>With a Masters in Data Science and 10+ years leading initiatives at major banks, I speak the language of the Boardroom.</p>
              <p>But as a developer who has built and deployed mobile apps to the App Store, I also speak the language of the Engineering team.</p>
              <p>This hybrid expertise allows me to bridge the gap between "Business Requirements" and "Technical Reality," ensuring your project is delivered on time, on budget, and without the fluff.</p>
            </div>

            <div className="mt-10 pt-10 border-t border-stone-200 grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-stone-900">10+</div>
                <div className="text-base text-stone-500 mt-1">Years PM Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-stone-900">3</div>
                <div className="text-base text-stone-500 mt-1">Products Shipped 0→1</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-stone-900">500+</div>
                <div className="text-base text-stone-500 mt-1">Sprints Facilitated</div>
              </div>
            </div>

            {/* PM achievements strip */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { icon: <LayoutList size={16} />, text: "Backlog ownership & roadmap definition" },
                { icon: <Users size={16} />, text: "Cross-functional stakeholder alignment" },
                { icon: <GitBranch size={16} />, text: "Agile / Scrum delivery across 5 orgs" },
                { icon: <TrendingUp size={16} />, text: "Measurable outcomes: 79% ↑ security, 30% ↑ efficiency" },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
                  <span className="text-emerald-600 mt-0.5 shrink-0">{icon}</span>
                  <span className="text-sm text-stone-600 leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-100 w-full">
            <h3 className="text-xl font-bold text-stone-900 mb-8">Technical Arsenal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Corporate Experience</p>
                {['Archer GRC', 'Tableau', 'SQL / Data Science'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                    {i === 0 ? <ShieldCheck className="text-blue-600" /> : i === 1 ? <LineChart className="text-blue-600" /> : <Code2 className="text-blue-600" />}
                    <span className="font-medium text-stone-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Built Products</p>
                {['Flutter & Dart', 'React & Node.js', 'Firebase'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-emerald-600"><Code2 /></span>
                    <span className="font-medium text-stone-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Generator floating button — bottom-right of section */}
      <div className="absolute bottom-6 right-6">
        <button
          type="button"
          onClick={() => setShowSigGen(true)}
          title="Digital Signature Generator"
          className="flex items-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white text-xs font-medium font-sans px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-emerald-200 hover:scale-105"
        >
          ✍️ Signature Generator
        </button>
      </div>

      {showSigGen && <SignatureGenerator onClose={() => setShowSigGen(false)} />}
    </section>
  );
};

export default About;
