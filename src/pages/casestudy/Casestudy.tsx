import { ArrowLeft, ArrowRight, Building2, CheckCircle2, ListChecks, User } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router"; 
import { allProjects } from "../../data/portFolioData";

const Casestudy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = allProjects.find(p => p.slug === slug);

  const displayImage = project?.coverImage || project?.image || "/assets/images/placeholder.png";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Project Not Found</h1>
        <button onClick={() => navigate('/projects')} className="text-emerald-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Projects
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">

      <header className="bg-stone-900 pt-32 pb-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-900/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="w-full px-6 lg:px-16 relative z-10">
          <Link to="/projects" className="inline-flex items-center text-stone-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Projects
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 text-xs font-bold uppercase tracking-wide">
              {project.category}
            </span>
            {project.duration && (
              <span className="text-stone-400 text-sm font-mono">
                // {project.duration}
              </span>
            )}
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-8 max-w-4xl leading-tight">
            {project.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-800 pt-8">
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-wider font-bold mb-1">Client</p>
              <p className="text-lg font-medium flex items-center gap-2">
                <Building2 size={18} className="text-emerald-500" /> {project.client}
              </p>
            </div>
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-wider font-bold mb-1">My Role</p>
              <p className="text-lg font-medium flex items-center gap-2">
                <User size={18} className="text-emerald-500" /> {project.role}
              </p>
            </div>
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-wider font-bold mb-1">Tech Stack</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.techStack.map(tech => (
                  <span key={tech} className="text-sm bg-stone-800 text-stone-300 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

          <div className="lg:col-span-8 space-y-16">

            <div className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-video shadow-lg">
              <img
                src={displayImage}
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {project.challenge && (
              <section>
                <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">1</span>
                  The Challenge
                </h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {project.challenge}
                </p>
              </section>
            )}

            {project.solution && (
              <section>
                <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                  The Solution
                </h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {project.solution}
                </p>
              </section>
            )}

            {project.fullDetails && (
              <section>
                <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">3</span>
                  Detailed Responsibilities
                </h2>
                <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
                  <ul className="space-y-4">
                    {project.fullDetails.map((detail, idx) => (
                      <li key={idx} className="flex gap-4 items-start text-stone-700 leading-relaxed">
                        <ListChecks className="shrink-0 text-emerald-600 mt-1" size={20} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100 sticky top-24">
              <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" /> Key Outcomes
              </h3>

              <div className="space-y-6">
                {project.results?.map((result, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-emerald-200">
                    <p className="text-stone-700 font-medium leading-relaxed">
                      {result}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-stone-200">
                <Link
                  to="/booking"
                  className="w-full py-4 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  Hire Me for Results <ArrowRight size={18} />
                </Link>
                <p className="text-xs text-center text-stone-400 mt-3">
                  Available for fractional or full-time roles
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <nav className="border-t border-stone-100 bg-stone-50 py-16">
        <div className="w-full px-6 lg:px-16 text-center">
          <p className="text-stone-400 text-sm uppercase tracking-widest font-bold mb-4">Ready for the next one?</p>
          <Link to="/projects" className="text-3xl font-bold text-stone-900 hover:text-emerald-600 transition-colors inline-flex items-center gap-3">
            View All Projects <ArrowRight />
          </Link>
        </div>
      </nav>

    </article>
  );
};

export default Casestudy;