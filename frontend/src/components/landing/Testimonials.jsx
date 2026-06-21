const testimonials = [
  {
    quote: "FuncSpan saved our team weeks of debugging. We were able to reproduce microservice timeouts and state-sync race conditions in local developer environments within minutes.",
    author: "Elena Rostova",
    role: "Principal Systems Architect",
    company: "CloudCore Systems",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Testing API schema degradation used to require custom scripts that broke constantly. FuncSpan's Schema Mutation panel allowed us to inject payload breaks with zero effort.",
    author: "Marcus Chen",
    role: "Lead DevOps Engineer",
    company: "DevSync",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The visual Traffic Inspector is outstanding. Being able to run stress tests and watch logs react instantly on my phone while monitoring server stats is a superpower.",
    author: "Sarah Jenkins",
    role: "Director of Engineering",
    company: "VeloScale",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-24 bg-[#050814]/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest bg-secondary-400/10 px-3 py-1 rounded-full border border-secondary-500/20">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
            Trusted by Infrastructure Teams
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            See how engineering teams use FuncSpan to guarantee reliability for high-traffic microservices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/30 backdrop-blur-xl border border-white/5 p-8 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors duration-300"
            >
              <div>
                {/* Quote Icon */}
                <span className="text-5xl font-serif text-primary-400/20 block leading-none mb-4">“</span>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <img 
                  src={t.avatar} 
                  alt={t.author} 
                  className="w-10 h-10 rounded-full object-cover border border-primary-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.role}</p>
                  <p className="text-[9px] text-primary-400 font-semibold uppercase tracking-wider mt-1">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
