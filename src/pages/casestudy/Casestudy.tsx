import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Lightbulb, ListChecks, TrendingUp, User } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { allProjects } from "../../data/portFolioData";

const Casestudy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = allProjects.find(p => p.slug === slug);
  const displayImage = project?.coverImage || project?.image || "/assets/images/placeholder.png";
  const isStar = !!(project?.situation && project?.task && project?.action && project?.outcome);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Project Not Found</h1>
        <button type="button" onClick={() => navigate('/projects')} className="text-emerald-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Projects
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">

      {/* ── Header ── */}
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
              <span className="text-stone-400 text-sm font-mono">// {project.duration}</span>
            )}
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-8 max-w-4xl leading-tight">{project.title}</h1>
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
                  <span key={tech} className="text-sm bg-stone-800 text-stone-300 px-2 py-1 rounded">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

          {/* ── Main content ── */}
          <div className="lg:col-span-8 space-y-16">

            {/* Cover image */}
            <div className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-video shadow-lg">
              <img src={displayImage} alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            {/* ── STAR format (PO case studies) ── */}
            {isStar ? (
              <>
                {/* Metrics strip */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.metrics.map(({ value, label }) => (
                      <div key={label} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                        <div className="text-3xl font-bold text-emerald-700 mb-1">{value}</div>
                        <div className="text-xs text-stone-500 font-medium uppercase tracking-wide leading-tight">{label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Situation */}
                <section>
                  <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-sm font-bold shrink-0">S</span>
                    Situation
                  </h2>
                  <p className="text-lg text-stone-600 leading-relaxed">{project.situation}</p>
                </section>

                {/* Task */}
                <section>
                  <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">T</span>
                    My Role &amp; Mandate
                  </h2>
                  <p className="text-lg text-stone-600 leading-relaxed">{project.task}</p>
                </section>

                {/* Action */}
                <section>
                  <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">A</span>
                    What I Did
                  </h2>
                  <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
                    <ul className="space-y-5">
                      {project.action!.map((item, idx) => (
                        <li key={idx} className="flex gap-4 items-start text-stone-700 leading-relaxed">
                          <ListChecks className="shrink-0 text-emerald-600 mt-0.5" size={20} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Result */}
                <section>
                  <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">R</span>
                    Results
                  </h2>
                  <div className="space-y-4">
                    {project.outcome!.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <TrendingUp className="shrink-0 text-emerald-600 mt-0.5" size={20} />
                        <span className="text-stone-700 font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
                {/* Lessons Learned */}
                {project.lessonsLearned && (
                  <section>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <Lightbulb size={16} />
                      </span>
                      What I'd Do Differently
                    </h2>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8">
                      <p className="text-stone-700 leading-relaxed text-lg">{project.lessonsLearned}</p>
                    </div>
                  </section>
                )}
              </>
            ) : (
              /* ── Legacy format (non-PO case studies) ── */
              <>
                {project.challenge && (
                  <section>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">1</span>
                      The Challenge
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">{project.challenge}</p>
                  </section>
                )}
                {project.solution && (
                  <section>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                      The Solution
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">{project.solution}</p>
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
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100 sticky top-24">
              <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" /> Key Outcomes
              </h3>
              <div className="space-y-5">
                {(project.outcome || project.results)?.map((result, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-emerald-200">
                    <p className="text-stone-700 font-medium leading-relaxed">{result}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-stone-200">
                <Link to="/booking"
                  className="w-full py-4 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg">
                  Hire Me for Results <ArrowRight size={18} />
                </Link>
                <p className="text-xs text-center text-stone-400 mt-3">Available for fractional or full-time roles</p>
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
