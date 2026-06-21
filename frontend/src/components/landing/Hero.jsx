import { ArrowRight, Play, Server, Terminal, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-[#050814]">
      {/* Background Glowing Lines & Radial Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary-500/10 via-transparent to-transparent blur-3xl pointer-events-none z-0" />

      {/* Network Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text block */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/25 px-3 py-1 rounded-full text-[10px] font-bold text-primary-400 tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5" />
              Network Emulation Engine v2.0
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Simulate Network Degradation <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                With One Proxy Route
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              FuncSpan emulates latency, forces status code failures, and mutates response schemas in real-time. Guarantee your frontend application behaves under chaotic server conditions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-primary-400 to-secondary-400 hover:from-primary-300 hover:to-secondary-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.25)] transition duration-200"
              >
                Launch Playground Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-2 transition duration-200"
              >
                <Terminal className="w-4 h-4 text-slate-400" />
                Read API Reference
              </a>
            </div>
          </div>

          {/* Interactive Console Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 rounded-2xl blur-xl pointer-events-none z-0" />

            <div className="relative z-10 bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden font-mono text-[10px] leading-relaxed text-slate-400 w-full">
              {/* Console top bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0A1020]/90 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger-500/30 border border-danger-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning-500/30 border border-warning-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success-500/30 border border-success-500/40" />
                </div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-primary-400" />
                  network_terminal.sh
                </span>
              </div>

              {/* Console log content */}
              <div className="p-5 space-y-3.5 max-h-72 overflow-y-auto">
                <div>
                  <span className="text-slate-500">[09:22:15]</span> <span className="text-primary-400 font-bold">INFO:</span> Initializing network simulation engine...
                </div>
                <div>
                  <span className="text-slate-500">[09:22:16]</span> <span className="text-primary-400 font-bold">INFO:</span> Proxy route set up at <span className="text-white underline">http://mock.funclexa.com/p/proxy_89f0</span>
                </div>
                <div>
                  <span className="text-slate-500">[09:22:18]</span> <span className="text-warning-400 font-bold">WARN:</span> Injecting simulated latency: <span className="text-white">450ms</span> (+/- 50ms jitter)
                </div>
                <div>
                  <span className="text-slate-500">[09:22:20]</span> <span className="text-secondary-400 font-bold">LOG:</span> <span className="px-1 bg-success-500/10 text-success-400 border border-success-500/20 rounded font-semibold text-[9px]">GET 200</span> /api/users - resolved in 448ms
                </div>
                <div>
                  <span className="text-slate-500">[09:22:23]</span> <span className="text-danger-400 font-bold">FAIL:</span> Injected status code error: <span className="px-1 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded font-semibold text-[9px]">503 Service Unavailable</span> for route /api/checkout
                </div>
                <div>
                  <span className="text-slate-500">[09:22:25]</span> <span className="text-secondary-400 font-bold">MUTATE:</span> Dropped fields <span className="text-white">['billingAddress', 'creditCardHash']</span> from response schema object
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="animate-pulse">❯</span>
                  <span className="w-1.5 h-3 bg-primary-400 animate-pulse inline-block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
