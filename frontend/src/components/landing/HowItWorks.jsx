import { ArrowRight, Settings, Activity, ShieldAlert } from 'lucide-react';

const steps = [
  {
    num: "01",
    title: "Generate Proxy Route",
    desc: "Paste your destination backend API URL. FuncSpan will construct a secure, branded proxy endpoint ready to receive requests.",
    icon: Settings
  },
  {
    num: "02",
    title: "Configure Conditions",
    desc: "Inject artificial latency, customize failure rates, inject response error codes (400, 500, etc.), or define schema mutations.",
    icon: ShieldAlert
  },
  {
    num: "03",
    title: "Inspect & Stress Test",
    desc: "Monitor incoming traffic, analyze latency logs in the console, or execute load testing directly via the stress-test suite.",
    icon: Activity
  }
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 bg-[#050814]/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest bg-primary-400/10 px-3 py-1 rounded-full border border-primary-500/20">
            WORKFLOW
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
            Emulate Network Hazards in 3 Steps
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            No SDKs to install, no code config changes. Simply swap your base URL and control your backend simulation dashboard in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-primary-500/10 via-secondary-500/20 to-primary-500/10 -translate-y-12 z-0" />

          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center relative z-10 group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-white mb-6 relative group-hover:border-primary-400/50 transition-all duration-300">
                <step.icon className="w-6 h-6 text-primary-400" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-slate-950 font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center">
                  {step.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
