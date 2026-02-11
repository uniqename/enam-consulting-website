import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

const PortfolioPreview = () => {
  return (
    <section id="portfolio" className="py-24 bg-stone-50 border-t border-stone-200 w-full">
      <div className="w-full px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Selected Work</h2>
            <p className="text-stone-600 text-lg">From Enterprise Banking to Social Impact Apps.</p>
          </div>
          <Link to="/projects" className="hidden md:flex items-center text-emerald-700 font-bold text-lg hover:gap-3 transition-all">
            View All Projects <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Link to="/work/homelink-gh" className="group relative block overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="h-80 bg-slate-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
              <img src="/assets/images/homelinkgh_logo.png" alt="HomeLinkGH App" className="w-[70%] h-[70%] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-bold">Mobile App</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors">HomeLinkGH Service Platform</h3>
              <p className="text-stone-600 mb-6 line-clamp-2 leading-relaxed">
                A powered marketplace connecting homeowners with verified service providers. Features real-time booking, Ghana Card verification, and dynamic pricing.
              </p>
              <div className="flex gap-3">
                <span className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium">Flutter</span>
                <span className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium">Firebase</span>
              </div>
            </div>
          </Link>

          <Link to="/work/enterprise-grc" className="group relative block overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="h-80 bg-stone-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
              <img src="assets/images/comerica.png" alt="GRC Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold">Enterprise SaaS</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors">Comerica Bank GRC Transformation</h3>
              <p className="text-stone-600 mb-6 line-clamp-2 leading-relaxed">
                Led strategic initiative resulting in 17% reduction in portfolio risk and 30% operational efficiency improvement through automated risk workflows.
              </p>
              <div className="flex gap-3">
                <span className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium">Archer GRC</span>
                <span className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium">Tableau</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link to="/projects" className="inline-flex items-center text-emerald-700 font-bold text-lg">
            View All Projects <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;