import { Github, Twitter, Linkedin, Terminal, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050814]/90 py-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-16">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="FuncLexa Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent uppercase tracking-wider font-mono">FuncSpan</span>
                <span className="block text-[10px] text-slate-500 tracking-wider">NETWORK SIMULATION</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enterprise-grade network emulation, latency modeling, and schema testing for resilient microservices.
            </p>
            <div className="flex items-center gap-3 text-slate-500">
              <a href="#" className="hover:text-primary-400 transition"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary-400 transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary-400 transition"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary-400 transition"><Globe className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition">Network Simulator</a></li>
              <li><a href="#" className="hover:text-white transition">Traffic Inspector</a></li>
              <li><a href="#" className="hover:text-white transition">Stress Testing</a></li>
              <li><a href="#" className="hover:text-white transition">Payload Generator</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Status Page</a></li>
              <li><a href="#" className="hover:text-white transition">System Architecture</a></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security Info</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FuncSpan (FuncLexa). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-ping" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
