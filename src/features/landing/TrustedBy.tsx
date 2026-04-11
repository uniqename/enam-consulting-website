const TrustedBy = () => {
  return (
    <>
      <section className="py-12 bg-white border-y border-stone-100 w-full">
        <div className="w-full px-6 text-center">
          <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-8">Trusted by Fortune 500 Leaders & Mission-Driven Orgs</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-3xl font-bold font-serif text-stone-800">CHASE</span>
            <span className="text-3xl font-bold tracking-tighter text-stone-800">TARGET</span>
            <span className="text-3xl font-serif italic font-bold text-stone-800">Comerica</span>
            <span className="text-3xl font-bold text-stone-800">Huntington</span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-50 border-b border-stone-100 w-full">
        <div className="w-full px-6 lg:px-16">
          <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest text-center mb-12">What Clients Say</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            <figure className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm flex flex-col">
              <blockquote className="text-stone-700 text-lg leading-relaxed mb-6 grow">
                "Enam didn't just build us an app — she helped us think through what we actually needed before a single line of code was written. The platform replaced four tools we were juggling and gave our leadership real-time visibility into our finances for the first time. It changed how we operate."
              </blockquote>
              <div className="pt-4 border-t border-stone-100">
                <figcaption className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">FK</div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">Senior Leadership</p>
                    <p className="text-stone-500 text-sm">Faith Klinik Ministries · Church Management Platform</p>
                  </div>
                </figcaption>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">4 tools → 1 platform</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">Real-time financial visibility</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">Live streaming</span>
                </div>
              </div>
            </figure>

            <figure className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm flex flex-col">
              <blockquote className="text-stone-700 text-lg leading-relaxed mb-6 grow">
                "What stood out was how quickly Enam got up to speed on our constraints — technically and organizationally. She ran sprints like a senior PM while also understanding exactly what the engineering team needed to ship. That combination is rare."
              </blockquote>
              <div className="pt-4 border-t border-stone-100">
                <figcaption className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">CB</div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">Risk Technology Director</p>
                    <p className="text-stone-500 text-sm">Comerica Bank · Enterprise GRC Transformation</p>
                  </div>
                </figcaption>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">17% risk reduction</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">30% efficiency gain</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">Fortune 500</span>
                </div>
              </div>
            </figure>

          </div>

          <p className="text-center text-stone-400 text-sm mt-10">
            References available upon request for enterprise engagements.{' '}
            <a href="mailto:ename@doxaandco.co" className="text-emerald-600 hover:underline">Email to ask.</a>
          </p>
        </div>
      </section>
    </>
  );
};

export default TrustedBy;