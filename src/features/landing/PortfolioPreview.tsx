import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    slug: "homelink-gh",
    badge: "Product & Engineering",
    badgeColor: "bg-emerald-600",
    image: "/assets/images/homelinkgh_logo.png",
    title: "HomeLinkGH Service Platform",
    description: "Defined the roadmap, owned the backlog, and shipped a dual-sided marketplace from 0→1 — covering 9 regions of Ghana across iOS and Android.",
    tags: ["Flutter", "Firebase"],
    bg: "bg-slate-200",
  },
  {
    slug: "enterprise-grc",
    badge: "Product Management",
    badgeColor: "bg-blue-600",
    image: "assets/images/comerica.png",
    title: "Comerica Bank GRC Transformation",
    description: "Acted as Product Owner for an enterprise GRC platform. Managed backlog and sprints to deliver 17% risk reduction and 30% efficiency gain.",
    tags: ["Archer GRC", "Tableau"],
    bg: "bg-stone-200",
  },
  {
    slug: "unified-risk-management",
    badge: "Product Management",
    badgeColor: "bg-blue-600",
    image: "/assets/images/huntington.png",
    title: "Huntington Bank Risk Integration",
    description: "Sr. Product Owner through a bank merger. Unified two GRC systems — increasing data security by 79% and availability by 56%.",
    tags: ["Archer", "Agile/Scrum"],
    bg: "bg-stone-200",
  },
  {
    slug: "beacon-app",
    badge: "Product & Engineering",
    badgeColor: "bg-emerald-600",
    image: "/assets/images/beacon_logo.png",
    title: "Beacon of New Beginnings",
    description: "Product-owned and built a privacy-first crisis support app for domestic abuse survivors. Shipped from 0→1 in 8 weeks with a zero-footprint architecture.",
    tags: ["Flutter", "SQLite"],
    bg: "bg-slate-200",
  },
];

const PortfolioPreview = () => {
  return (
    <section id="portfolio" className="py-24 bg-stone-50 border-t border-stone-200 w-full">
      <div className="w-full px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Selected Work</h2>
            <p className="text-stone-600 text-lg">Product ownership, delivery leadership, and engineering — across startups and Fortune 500s.</p>
          </div>
          <Link to="/projects" className="hidden md:flex items-center text-emerald-700 font-bold text-lg hover:gap-3 transition-all">
            View All Projects <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((p) => (
            <Link key={p.slug} to={`/work/${p.slug}`} className="group relative block overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300">
              <div className={`h-64 ${p.bg} overflow-hidden relative`}>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className={`px-4 py-2 rounded-full ${p.badgeColor} text-white text-sm font-bold`}>
                    {p.badge}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-stone-600 mb-6 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
                <div className="flex gap-3">
                  {p.tags.map((t) => (
                    <span key={t} className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
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
