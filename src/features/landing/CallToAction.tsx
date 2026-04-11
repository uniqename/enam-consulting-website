import { Link } from 'react-router';

const CallToAction = () => {
  return (
    <section className="py-32 bg-stone-900 text-white relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-200 h-200 bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="w-full px-6 max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">Let's Build Something Great.</h2>
        <p className="text-xl md:text-2xl text-stone-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          Whether you need to transform an enterprise risk platform or launch a startup MVP,
          I bring the discipline to manage it and the skills to build it.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/booking"
            className="px-12 py-5 rounded-full bg-emerald-600 text-white font-bold text-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/50 hover:-translate-y-1"
          >
            Start Your Project
          </Link>
          <a
            href="mailto:ename@doxaandco.co"
            className="px-12 py-5 rounded-full bg-transparent border-2 border-stone-700 text-white font-bold text-xl hover:bg-stone-800 hover:border-stone-600 transition-all"
          >
            Email Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;