
const TrustedBy = () => {
  return (
    <section className="py-12 bg-white border-y border-stone-100 w-full">
      <div className="w-full px-6 text-center">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-8">Trusted by Fortune 500 Leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-3xl font-bold font-serif text-stone-800">CHASE</span>
          <span className="text-3xl font-bold tracking-tighter text-stone-800">TARGET</span>
          <span className="text-3xl font-serif italic font-bold text-stone-800">Comerica</span>
          <span className="text-3xl font-bold text-stone-800">Huntington</span>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;