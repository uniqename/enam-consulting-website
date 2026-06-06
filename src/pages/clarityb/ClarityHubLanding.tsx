import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, Search, BarChart3, Layers, Rocket, TrendingUp, Check } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export default function ClarityHubLanding() {
  const phases = [
    {
      number: 1,
      title: 'Discover',
      icon: Search,
      description: 'Understand your current state with a structured business assessment',
    },
    {
      number: 2,
      title: 'Analyze',
      icon: BarChart3,
      description: 'Generate your Business Health Score and identify gaps',
    },
    {
      number: 3,
      title: 'Design',
      icon: Layers,
      description: 'Build your strategic roadmap and 90-day action plan',
    },
    {
      number: 4,
      title: 'Implement',
      icon: Rocket,
      description: 'Execute with milestone tracking and accountability',
    },
    {
      number: 5,
      title: 'Optimize',
      icon: TrendingUp,
      description: 'Measure KPIs, iterate, and scale what is working',
    },
  ];

  const tiers = [
    {
      name: 'Starter',
      price: '$49',
      features: ['Monthly assessments', 'Basic KPI tracking', 'Document access', '1 user'],
    },
    {
      name: 'Growth',
      price: '$99',
      features: ['Everything in Starter', 'Project milestone tracking', 'Team management (up to 5)', 'Strategic planning'],
      highlighted: true,
    },
    {
      name: 'Scale',
      price: '$199',
      features: ['Everything in Growth', 'Custom integrations', 'Dedicated advisor hours', 'Priority support', 'Unlimited users'],
    },
  ];

  return (
    <div className="bg-stone-50 w-full">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              Business Operating System
            </span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-stone-900 mb-6">
            From Chaos to <span className="text-emerald-600">Clarity</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            ClarityHub gives you the tools, assessments, and roadmap to run your business like a pro with a consultant in your corner.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/clarityb/assessment"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-stone-900 hover:bg-emerald-700 text-white font-semibold transition-colors"
            >
              Start Free Assessment <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              to="/clarityb/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-stone-200 text-stone-900 hover:bg-stone-100 font-semibold transition-colors"
            >
              Client Login
            </Link>
          </motion.div>

          {/* Health Score Card Mock */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm max-w-sm w-full">
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e7e5e4" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="8"
                      strokeDasharray={`${(73 / 100) * 282.7} 282.7`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-stone-900">
                      73
                    </text>
                  </svg>
                </div>
              </div>
              <div className="text-center mb-6">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Business Health Score</p>
                <p className="text-sm text-stone-600">Good Foundation</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Operations', 'Finance', 'Systems', 'Team'].map((metric) => (
                  <div key={metric} className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-600 mb-1">{metric}</p>
                    <p className="text-lg font-semibold text-stone-900">72</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 5 Phases Section */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Our Five-Phase Methodology</h2>
          <p className="text-lg text-stone-600">A proven framework for sustainable business growth</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: phase.number * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-stone-100 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                    {phase.number}
                  </div>
                  <Icon size={24} className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-3">{phase.title}</h3>
                <p className="text-sm text-stone-600">{phase.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* What Clients Get */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">What Clients Get</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Business Health Assessment',
              items: ['Comprehensive scoring', 'Gap analysis', 'Actionable insights'],
            },
            {
              title: 'Project Tracking',
              items: ['Phase-based roadmap', 'Milestone management', 'Real-time progress'],
            },
            {
              title: 'Document Library',
              items: ['SOP templates', 'Reports and plans', 'Deliverables'],
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-stone-100 p-8"
            >
              <h3 className="font-semibold text-stone-900 mb-4">{item.title}</h3>
              <ul className="space-y-3">
                {item.items.map((benefit, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Simple Pricing</h2>
          <p className="text-lg text-stone-600">Choose the plan that fits your business</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl border p-8 ${
                tier.highlighted
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-100'
              }`}
            >
              <h3 className={`font-semibold mb-2 ${tier.highlighted ? 'text-white' : 'text-stone-900'}`}>
                {tier.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className={tier.highlighted ? 'text-stone-300' : 'text-stone-600'}>/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check size={18} className={tier.highlighted ? 'text-emerald-300' : 'text-emerald-600'} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-white text-stone-900 hover:bg-stone-100'
                    : 'bg-stone-900 text-white hover:bg-emerald-700'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-stone-600 text-sm"
        >
          Already a client?{' '}
          <Link to="/clarityb/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Sign in to your portal
          </Link>
        </motion.p>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 lg:px-8 bg-stone-900 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start your free business assessment. No login required.
          </h2>
          <Link
            to="/clarityb/assessment"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-stone-900 hover:bg-emerald-50 font-semibold transition-colors"
          >
            Start Free Assessment <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
