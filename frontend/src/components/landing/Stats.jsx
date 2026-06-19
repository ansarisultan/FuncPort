const stats = [
  { value: "99.99%", label: "API Resilience Target", desc: "Build code that stands up to severe connection dropouts." },
  { value: "0ms - 10s", label: "Latency Simulation Range", desc: "Inject precise delays, custom timeouts, and jitter." },
  { value: "10M+", label: "Proxy Requests Routed", desc: "High-performance proxying for mock API endpoints." },
  { value: "100%", label: "Developer Experience Focused", desc: "Full control over error responses, latency presets, and fuzzed schemas." }
];

export default function Stats() {
  return (
    <section className="relative py-20 bg-[#050814]/80 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/20 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle hover background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">
                {s.value}
              </div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">{s.label}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
