import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { CheckCircle2, Linkedin, Mail, ArrowRight, Briefcase, GraduationCap, Building2 } from 'lucide-react';

const roles = [
  'Senior Product Manager',
  'Director of Product',
  'Head of AI / AI Product Lead',
  'VP of Product (Series A–C)',
  'Principal Product Owner — GRC / FinTech',
];

const credentials = [
  { label: 'PMP® Certified', detail: 'Project Management Professional' },
  { label: 'Certified Scrum Master', detail: 'CSM — Agile delivery' },
  { label: 'MS Data Science', detail: 'Analytics, ML fundamentals' },
  { label: '10+ Years PM', detail: 'Fortune 500 & startups' },
];

const experience = [
  { company: 'Comerica Bank', role: 'Sr. Product Owner — GRC', type: 'Fortune 500' },
  { company: 'Huntington National Bank', role: 'Sr. Product Owner — Risk Integration', type: 'Fortune 500' },
  { company: 'JP Morgan Chase', role: 'GRC Technology PM', type: 'Fortune 500' },
  { company: 'Target Corporation', role: 'Technology PM', type: 'Fortune 500' },
  { company: 'HomeLinkGH', role: 'Founder & Product Lead', type: 'Startup / 0→1' },
  { company: 'Beacon of New Beginnings', role: 'Founder & Product Engineer', type: 'Non-Profit Tech' },
];

const industries = [
  'Financial Services & Banking',
  'GRC / Compliance Technology',
  'AI & Automation Platforms',
  'Marketplace & B2B SaaS',
  'Mission-Driven / Non-Profit Tech',
  'Mobile (iOS / Android)',
];

const Hire = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-24">
      <div className="w-full px-6 lg:px-16 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Open to Full-Time Opportunities
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
            Senior Product Leader.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Available for the Right Role.
            </span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl leading-relaxed mb-8">
            I run a consulting practice and I'm also actively considering full-time leadership roles — the right company doesn't have to choose. I bring Fortune 500 delivery experience, hands-on technical ability, and a track record of building products from zero to one.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.linkedin.com/in/enamegyir/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0A66C2] text-white font-bold text-lg hover:bg-[#004182] transition-all shadow-lg hover:-translate-y-1"
            >
              <Linkedin size={20} /> View LinkedIn Profile
            </a>
            <a
              href="mailto:ename@doxaandco.co?subject=Full-Time Opportunity"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-stone-900 border border-stone-200 font-bold text-lg hover:bg-stone-50 transition-all"
            >
              <Mail size={20} /> Email Me
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Roles I'm open to */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-bold text-stone-900">Roles I'm Considering</h2>
              </div>
              <ul className="space-y-3">
                {roles.map(role => (
                  <li key={role} className="flex items-center gap-3 text-stone-700">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span className="font-medium">{role}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-sm text-stone-500 leading-relaxed">
                  <strong className="text-stone-700">Location:</strong> Based in Columbus, Ohio. Open to remote, hybrid, or relocation for the right role. Available immediately for fractional start; 2 weeks notice for full-time transition.
                </p>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Building2 size={20} />
                </div>
                <h2 className="text-xl font-bold text-stone-900">Where I've Delivered</h2>
              </div>
              <div className="space-y-3">
                {experience.map(exp => (
                  <div key={exp.company} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{exp.company}</p>
                      <p className="text-stone-500 text-sm">{exp.role}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-200 text-stone-600 shrink-0 mt-0.5">{exp.type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-stone-100">
                <a
                  href="https://www.linkedin.com/in/enamegyir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:gap-3 transition-all"
                >
                  Full work history on LinkedIn <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>

            {/* Industries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm"
            >
              <h2 className="text-xl font-bold text-stone-900 mb-6">Industry Depth</h2>
              <div className="flex flex-wrap gap-3">
                {industries.map(ind => (
                  <span key={ind} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-sm font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-stone-900 rounded-3xl p-8 text-white"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-lg font-bold">Credentials</h2>
              </div>
              <div className="space-y-4">
                {credentials.map(c => (
                  <div key={c.label} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">{c.label}</p>
                      <p className="text-stone-400 text-xs">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What I bring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm"
            >
              <h2 className="text-lg font-bold text-stone-900 mb-5">What Makes Me Different</h2>
              <div className="space-y-4">
                {[
                  { title: 'I build, not just manage', desc: 'I can write production code (Flutter, React, Firebase). Most PMs can\'t.' },
                  { title: 'Regulated industry depth', desc: '10+ years in banking GRC — I understand compliance-constrained delivery.' },
                  { title: 'Zero to one track record', desc: 'Three shipped products from idea to App Store.' },
                  { title: 'Bilingual: Business & Engineering', desc: 'I translate both ways without losing fidelity.' },
                ].map(item => (
                  <div key={item.title} className="border-l-2 border-emerald-500 pl-4">
                    <p className="font-bold text-stone-900 text-sm">{item.title}</p>
                    <p className="text-stone-500 text-xs leading-relaxed mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-600 rounded-3xl p-8 text-white"
            >
              <h2 className="text-lg font-bold mb-3">Ready to Talk?</h2>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                The best conversations start with a short note about the role and what problem you're trying to solve. I respond within one business day.
              </p>
              <a
                href="mailto:ename@doxaandco.co?subject=Full-Time Opportunity"
                className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all"
              >
                <Mail size={16} /> ename@doxaandco.co
              </a>
            </motion.div>

          </div>
        </div>

        {/* Back to consulting */}
        <div className="mt-16 text-center">
          <p className="text-stone-500 text-sm mb-4">Looking to hire Doxa &amp; Co as a consultant instead?</p>
          <Link to="/booking" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all">
            Book a Strategy Session <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hire;
