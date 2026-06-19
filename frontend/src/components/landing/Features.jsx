import { 
  ShieldAlert, Settings2, BarChart2, 
  Workflow, Zap, Sliders, Database, Terminal 
} from 'lucide-react';

const features = [
  {
    title: "Network Latency & Jitter",
    desc: "Inject artificial latency or simulate network jitter profiles (3G, slow cellular, edge outages) to test timeout thresholds.",
    icon: Settings2
  },
  {
    title: "Instant Error Injection",
    desc: "Force custom error status codes (4xx, 5xx) with specific failure rates to ensure your client apps degrade gracefully.",
    icon: ShieldAlert
  },
  {
    title: "Traffic Inspection Console",
    desc: "Detailed HTTP request logs and metric visualizations, tracking status, method, route, latency, and response size.",
    icon: BarChart2
  },
  {
    title: "Stress & Load Testing",
    desc: "Run background load simulations targeting your API. Visualize concurrent request charts and metrics in real-time.",
    icon: Zap
  },
  {
    title: "Schema Mutation Fuzzing",
    desc: "Fuzz payload response contracts by dropping keys, returning null values, or converting types to test client resilience.",
    icon: Database
  },
  {
    title: "Interactive AI Co-Pilot",
    desc: "Leverage a context-aware AI assistant that analyzes active proxy metrics and suggests optimization recommendations.",
    icon: Terminal
  }
];

export default function Features() {
  return (
    <section className="relative py-24 bg-[#050814]/30">
      {/* Background glow lamps */}
      <div className="absolute top-10 left-10 w-[30vw] h-[30vw] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30vw] h-[30vw] rounded-full bg-secondary-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest bg-secondary-400/10 px-3 py-1 rounded-full border border-secondary-500/20">
            PLATFORM FEATURES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
            Chaos Engineering Made Easy
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Inject, intercept, and analyze API traffic dynamically without rewriting a single line of backend application code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:border-primary-500/20 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 mb-4 group-hover:bg-primary-500/10 group-hover:text-primary-300 transition-colors duration-300">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
