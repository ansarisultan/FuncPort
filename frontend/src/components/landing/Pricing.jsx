import { Check } from 'lucide-react';

const tiers = [
  {
    name: "Developer",
    price: "Free",
    desc: "For local playground testing and individual developers.",
    features: [
      "1 active proxy connection",
      "Standard Latency injection (up to 2000ms)",
      "Standard Traffic Inspector logs (100 reqs)",
      "Predefined Scenarios & templates",
      "Context-aware AI assistant helper"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For full-stack engineering teams scaling microservices.",
    features: [
      "Unlimited active proxy connections",
      "Advanced Latency Injection & Jitter",
      "Payload Expansion & Schema Mutations",
      "Full Stress & Load Test runner (up to 500 concurrent)",
      "Export & import system configuration backups",
      "Webhook alert notifications"
    ],
    cta: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations requiring custom emulators & SLAs.",
    features: [
      "Dedicated high-speed simulation nodes",
      "Global latency edge routing simulation",
      "Custom payload schema generation and fuzzing",
      "SSO/SAML authentication & team workspaces",
      "Dedicated solutions engineer",
      "24/7 Priority support and monitoring"
    ],
    cta: "Contact Enterprise",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section className="relative py-24 bg-[#050814]/40">
      {/* Glow background lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-radial-glow opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest bg-primary-400/10 px-3 py-1 rounded-full border border-primary-500/20">
            PRICING PLANS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-4">
            Transparent Pricing for High-Scale Teams
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Select the network simulation plan that aligns with your testing scale, security requirements, and automation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 ${
                tier.popular 
                  ? 'bg-slate-900/80 border-primary-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] scale-[1.03]' 
                  : 'bg-slate-900/40 border-white/5 hover:border-white/10 shadow-lg'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-primary-400 to-secondary-400 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular choice
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-6 min-h-[32px]">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  {tier.period && <span className="text-sm text-slate-400">{tier.period}</span>}
                </div>

                <div className="border-t border-white/5 pt-6 mb-8">
                  <ul className="space-y-4">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition duration-200 ${
                tier.popular 
                  ? 'bg-gradient-to-r from-primary-400 to-secondary-400 hover:from-primary-300 hover:to-secondary-300 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
