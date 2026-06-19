import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Network, Zap, Shield, Globe, Clock, Activity,
  ArrowRight, Sparkles, Github, Twitter, Linkedin,
  Play, Check, Star, Users, Server, Cpu,
  Layers, GitBranch, Terminal, BarChart3,
  ChevronRight, Menu, X, Copy, ExternalLink,
  Box, Code, Database, Cloud, Smartphone, Brain,
  Rocket, Award, BookOpen, MessageCircle,
  Move, RotateCw, Eye, Droplet, Sun,
  Maximize2, Minimize2, RefreshCw,
  Layout, Type, Palette, Wand2
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const containerRef = useRef(null);

  // Live simulator metrics
  const [liveLatency, setLiveLatency] = useState(45);
  const [liveRequests, setLiveRequests] = useState(1048);
  const [liveSuccessRate, setLiveSuccessRate] = useState(99.4);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Interval for live simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(prev => Math.max(10, Math.min(200, Math.round(prev + (Math.random() * 20 - 10)))));
      setLiveRequests(prev => prev + Math.floor(Math.random() * 3) + 1);
      setLiveSuccessRate(prev => Math.max(95, Math.min(100, +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1))));
      setActiveNode(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Use Cases', href: '#features' },
    { label: 'Documentation', href: '#about' },
    { label: 'FuncLexa Ecosystem', href: '#projects' }
  ];

  const features = [
    {
      icon: Eye,
      title: 'Traffic Inspection',
      description: 'Monitor requests, responses, headers, status codes, payloads, and latency in real time.',
      color: 'from-primary-500 to-secondary-500',
      gradient: 'from-primary-500/20 to-secondary-500/10'
    },
    {
      icon: Database,
      title: 'Stress Testing',
      description: 'Generate concurrent traffic and measure API performance under load.',
      color: 'from-secondary-500 to-cyan-400',
      gradient: 'from-secondary-500/20 to-cyan-400/10'
    },
    {
      icon: Network,
      title: 'Network Simulation',
      description: 'Emulate packet loss, latency spikes, slow networks, and backend failures.',
      color: 'from-accent-500 to-rose-400',
      gradient: 'from-accent-500/20 to-rose-400/10'
    },
    {
      icon: Layers,
      title: 'Scenario Management',
      description: 'Save and load complex network configurations for rapid testing cycles.',
      color: 'from-warm-500 to-amber-400',
      gradient: 'from-warm-500/20 to-amber-400/10'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Built with security best practices and scalable architecture for production use.',
      color: 'from-primary-500 to-violet-400',
      gradient: 'from-primary-500/20 to-violet-400/10'
    },
    {
      icon: Brain,
      title: 'AI Assistant Integration',
      description: 'Persistent context-aware AI chatbot assistant to analyze reports and answer coding queries.',
      color: 'from-secondary-500 to-teal-400',
      gradient: 'from-secondary-500/20 to-teal-400/10'
    },
  ];

  const projects = [
    {
      title: 'LexaChat AI',
      description: 'Intelligent chat assistant with advanced LLM integration for real-time coding assistance.',
      icon: Brain,
      color: 'from-primary-500 to-secondary-500',
      status: 'Live',
      stats: '2.5K+ users'
    },
    {
      title: 'Flexa AI',
      description: 'Dynamic AI virtual assistant with voice and text interaction in multiple languages.',
      icon: MessageCircle,
      color: 'from-secondary-500 to-cyan-400',
      status: 'Beta',
      stats: '1.2K+ users'
    },
    {
      title: 'FuncPort',
      description: 'Network testing platform with traffic inspection, proxy routing, and stress testing.',
      icon: Network,
      color: 'from-accent-500 to-rose-400',
      status: 'Beta',
      stats: '5K+ tests'
    },
    {
      title: 'FuncLexa Assets',
      description: 'Premium developer workspace with design tools and component library.',
      icon: Layers,
      color: 'from-warm-500 to-amber-400',
      status: 'Live',
      stats: '3K+ assets'
    }
  ];

  const stats = [
    // { value: 'Traffic', label: 'Inspection', icon: Eye },
    // { value: 'Stress', label: 'Testing', icon: Activity },
    // { value: 'Network', label: 'Simulation', icon: Network },
    // { value: 'Scenario', label: 'Management', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-x-hidden relative" ref={containerRef}>
      {/* Dynamic 3D Background with Enhanced Glows & Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Full-Screen Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

        {/* Ambient Top Glow Source (Removes Too Dark Feel) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[55vh] rounded-full bg-gradient-to-b from-[#3b82f6]/20 via-[#6366f1]/8 to-transparent blur-[140px] pointer-events-none" />

        {/* Primary Glow */}
        <div
          className="absolute w-[65vw] h-[65vw] rounded-full blur-3xl transition-all duration-1000 opacity-90"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.32), transparent 70%)',
            top: `${(mousePosition.y / window.innerHeight) * 30}%`,
            left: `${(mousePosition.x / window.innerWidth) * 30}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Secondary Glow */}
        <div
          className="absolute w-[45vw] h-[45vw] rounded-full blur-3xl transition-all duration-700 opacity-90"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.26), transparent 70%)',
            bottom: `${(1 - mousePosition.y / window.innerHeight) * 30}%`,
            right: `${(1 - mousePosition.x / window.innerWidth) * 30}%`,
            transform: 'translate(50%, 50%)',
          }}
        />
        {/* Tertiary Glow */}
        <div
          className="absolute w-[35vw] h-[35vw] rounded-full blur-3xl transition-all duration-500 opacity-90"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.20), transparent 70%)',
            top: `${50 + ((mousePosition.y / window.innerHeight) - 0.5) * 20}%`,
            left: `${50 + ((mousePosition.x / window.innerWidth) - 0.5) * 20}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Animated Orbs */}
        <div className="absolute top-[5%] left-[5%] w-80 h-80 rounded-full bg-primary-500/12 blur-3xl animate-float-slow" />
        <div className="absolute bottom-[10%] right-[8%] w-[30rem] h-[30rem] rounded-full bg-secondary-500/12 blur-3xl animate-float-medium" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-[35%] right-[10%] w-64 h-64 rounded-full bg-accent-500/10 blur-3xl animate-float-fast" style={{ animationDelay: '-4s' }} />

        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-primary-400/40 animate-float-slow" />
        <div className="absolute bottom-[30%] right-[25%] w-3 h-3 rounded-full bg-secondary-400/40 animate-float-medium" style={{ animationDelay: '-1s' }} />
        <div className="absolute top-[60%] left-[60%] w-1.5 h-1.5 rounded-full bg-accent-400/40 animate-float-fast" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[10%] right-[40%] w-2 h-2 rounded-full bg-warm-400/40 animate-float-slow" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Premium Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-[#0b0f19]/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="FuncLexa Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-110 transition-all duration-500"
            />

            <div>
              <span className="text-xl font-bold text-gradient-animated-funclexa tracking-tight font-sans">FuncPort</span>
              <span className="hidden sm:inline text-[10px] text-slate-400 ml-2 font-medium">by FuncLexa</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-slate-300 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
            <Link
              to="/app"
              className="relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Open Playground
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5 hover:border-white/10"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0b0f19]/95 backdrop-blur-2xl border-b border-white/5 px-6 py-6"
            >
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm text-slate-300 hover:text-white transition px-4 py-2.5 rounded-xl hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/app"
                  className="text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:opacity-90 transition block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Open Playground
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 px-6 overflow-hidden z-10">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-4 animate-pulse-slow">
                <img src="/logo.png" alt="FuncLexa Logo" className="w-5 h-5 object-contain" />
                <span>Part of the FuncLexa Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] mb-2">
                <span className="text-white">
                  Stress Test APIs Under
                </span>
                <br />
                <div className="relative inline-block mt-4">
                  {/* Animated Border */}
                  <div className="absolute -inset-[2px] rounded-[30px] overflow-hidden">
                    <div className="absolute inset-0 funcport-border-animation" />
                  </div>
                  {/* Inner Box */}
                  <div className="relative bg-[#060B17] px-8 py-4 rounded-[28px] border border-white/5 backdrop-blur-xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300">
                      FuncPort
                    </span>
                  </div>
                </div>
              </h1>

              {/* FuncLexa Branding - Ultra Responsive Line */}
              <div className="mt-2 mb-4 flex items-center gap-3 justify-start">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
                <span className="text-slate-500 text-xs sm:text-sm uppercase tracking-[0.25em] whitespace-nowrap">
                  Powered By
                </span>
                <span className="text-cyan-400 font-semibold text-base sm:text-lg tracking-wide uppercase">
                  FuncLexa
                </span>
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
              </div>

              <p className="text-lg sm:text-xl text-slate-300 mb-6 max-w-lg leading-relaxed">
                FuncPort is a network testing platform from the FuncLexa ecosystem for simulating latency, failures, traffic loads, and backend behavior before deployment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/app"
                  className="relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white text-lg group inline-flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Open Playground
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5 transition flex items-center justify-center gap-2 group text-lg"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition" />
                  View Features
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-6">
                {[
                  { icon: Check, label: 'Traffic Inspection', color: 'text-success-400' },
                  { icon: Check, label: 'Stress Testing', color: 'text-success-400' },
                  { icon: Check, label: 'Network Simulation', color: 'text-success-400' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Developer Credit - Premium Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-5 panel-glassmorphism rounded-2xl inline-flex items-center gap-4 hover:border-primary-500/30 transition duration-500 group"
              >
                <img
                  src="/profile.jpeg"
                  alt="Sultan Salauddin Ansari"
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/50 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-110 transition duration-500"
                />
                <div>
                  <div className="text-base font-semibold text-white">Sultan Salauddin Ansari</div>
                  <div className="text-xs text-primary-400 font-medium mt-0.5">• Creator of FuncLexa  </div>
                  <div className="flex gap-3 mt-2">
                    <a href="https://github.com/ansarisultan" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href="https://x.com/ansari_sultan07" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="https://www.linkedin.com/in/SultanSAnsari" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - 3D Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative perspective-1000"
            >
              <div className="panel-glassmorphism p-8 preserve-3d relative">
                {/* Visual glow overlay */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary-500/35 to-secondary-500/35 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-accent-500/30 to-rose-400/30 rounded-full blur-3xl animate-float-medium" style={{ animationDelay: '-2s' }} />

                <div className="relative">
                  {/* Premium Showcase Card */}
                  <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <div className="p-8">
                      <div className="flex items-center gap-5 mb-8">
                        <img src="/logo.png" alt="FuncLexa Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(99,102,241,0.25)]" />
                        <div>
                          <h3 className="text-2xl font-bold text-gradient-animated-funclexa">FuncPort</h3>
                          <p className="text-xs text-primary-400 font-semibold tracking-wider uppercase">FuncLexa</p>
                        </div>
                      </div>

                      {/* Live Network Simulation Diagram */}
                      <div className="p-4 mb-6 rounded-2xl bg-white/[0.04] border border-white/5 relative overflow-hidden">
                        <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                          <span>LIVE TRAFFIC SIMULATOR</span>
                          <span className="flex items-center gap-1.5 text-primary-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-ping" />
                            Active
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 relative z-10">
                          {/* Client Node */}
                          <div className={`p-2 rounded-xl border transition-all duration-500 text-center flex-1 ${activeNode === 0 ? 'bg-primary-500/10 border-primary-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-900/40 border-white/5'
                            }`}>
                            <Users className="w-5 h-5 mx-auto text-primary-400 mb-1" />
                            <div className="text-[10px] font-bold text-white">Client</div>
                            <div className="text-[8px] text-slate-400 font-mono">GET /api</div>
                          </div>

                          {/* SVG Flow lines */}
                          <div className="flex-1 h-8 relative flex items-center justify-center">
                            <svg className="w-full h-full overflow-visible" fill="none">
                              <path d="M 0 16 L 80 16" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                              <path d="M 0 16 L 80 16" stroke="url(#gradient-flow)" strokeWidth="2.5" strokeDasharray="8 30" strokeDashoffset="0" className="animate-flow-dash" />
                              <defs>
                                <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
                                  <stop offset="50%" stopColor="#6366F1" />
                                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          {/* Proxy Node */}
                          <div className={`p-2 rounded-xl border transition-all duration-500 text-center flex-1 ${activeNode === 1 ? 'bg-secondary-500/10 border-secondary-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-slate-900/40 border-white/5'
                            }`}>
                            <Network className="w-5 h-5 mx-auto text-secondary-400 mb-1" />
                            <div className="text-[10px] font-bold text-white">FuncPort</div>
                            <div className="text-[8px] text-primary-400 font-semibold font-mono">Proxy</div>
                          </div>

                          {/* SVG Flow lines */}
                          <div className="flex-1 h-8 relative flex items-center justify-center">
                            <svg className="w-full h-full overflow-visible" fill="none">
                              <path d="M 0 16 L 80 16" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                              <path d="M 0 16 L 80 16" stroke="url(#gradient-flow2)" strokeWidth="2.5" strokeDasharray="8 30" strokeDashoffset="0" className="animate-flow-dash" />
                              <defs>
                                <linearGradient id="gradient-flow2" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#6366F1" />
                                  <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          {/* Destination Node */}
                          <div className={`p-2 rounded-xl border transition-all duration-500 text-center flex-1 ${activeNode === 2 ? 'bg-accent-500/10 border-accent-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-slate-900/40 border-white/5'
                            }`}>
                            <Server className="w-5 h-5 mx-auto text-accent-400 mb-1" />
                            <div className="text-[10px] font-bold text-white">Backend</div>
                            <div className="text-[8px] text-slate-400 font-mono">200 OK</div>
                          </div>
                        </div>

                        {/* Live Metrics Row */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
                          <div>
                            <div className="text-[9px] text-slate-400 uppercase font-semibold">Latency</div>
                            <div className="text-xs font-bold text-white font-mono">{liveLatency}ms</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-400 uppercase font-semibold">Requests</div>
                            <div className="text-xs font-bold text-white font-mono">{liveRequests}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-400 uppercase font-semibold">Success Rate</div>
                            <div className="text-xs font-bold text-white font-mono">{liveSuccessRate}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Status</span>
                          <span className="flex items-center gap-2 text-success-400">
                            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                            Live
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-slate-300">Ecosystem</span>
                          <span className="text-primary-400 font-semibold">FuncLexa</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats Cards */}
                  <div className="absolute -bottom-6 -left-6 glass-gradient p-4 rounded-2xl border border-white/10 animate-float-slow shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <Code className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-300">Scenarios</div>
                        <div className="text-xl font-bold text-white">12+</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 glass-gradient p-4 rounded-2xl border border-white/10 animate-float-medium shadow-2xl" style={{ animationDelay: '-2s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-secondary-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-300">Tests</div>
                        <div className="text-xl font-bold text-white">5K+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        {/* Glow overlay for features title */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-4">
              <Sparkles className="w-3 h-3" />
              Premium Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Built for <span className="text-gradient-cyber">Network Testing</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Built as part of the FuncLexa ecosystem to help developers validate frontend and backend reliability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                className="panel-glassmorphism p-8 group hover:border-primary-500/30 hover:shadow-[0_0_50px_rgba(99,102,241,0.05)] transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(99,102,241,0.15)] group-hover:scale-110 transition duration-500`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                <div className="mt-4 w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full group-hover:w-20 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-medium mb-4">
              <Award className="w-3 h-3" />
              About
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Behind <span className="text-gradient-animated-funclexa font-extrabold">FuncPort</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Built to help developers test, simulate, and debug network conditions before production deployment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="panel-glassmorphism p-10 hover:border-primary-500/30 transition duration-500"
            >
              <div className="flex items-center gap-6 mb-6">
                <img
                  src="/profile.jpeg"
                  alt="Sultan Salauddin Ansari"
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary-500/50 shadow-[0_0_30px_rgba(99,102,241,0.4)] animate-float-slow"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white font-sans">Sultan Salauddin Ansari</h3>
                  <p className="text-sm text-primary-400 font-medium mt-1">Creator of FuncPort • Founder of FuncLexa</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                A passionate full-stack developer and AI engineer dedicated to building
                innovative, AI-integrated web applications. FuncPort is a reflection of
                expertise in modern web technologies and scalable system architecture.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="https://github.com/ansarisultan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                  <Github className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
                </a>
                <a href="https://x.com/ansari_sultan07" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                  <Twitter className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
                </a>
                <a href="https://www.linkedin.com/in/SultanSAnsari" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                  <Linkedin className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Experience', value: '3+ Years', icon: Code },
                { label: 'Projects', value: '12+', icon: Rocket },
                { label: 'Tech Stack', value: 'MERN + AI', icon: Database },
                { label: 'Ecosystem', value: 'FuncLexa', icon: Star },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="panel-glassmorphism p-6 text-center hover:border-primary-500/30 transition duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="text-2xl font-bold text-gradient-cyber">{item.value}</div>
                  <div className="text-sm text-slate-300 mt-1">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-warm-500/10 border border-warm-500/20 text-warm-400 text-xs font-medium mb-4">
              <Box className="w-3 h-3" />
              Tech Stack
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-cyber">Modern</span> Development Stack
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Industry-leading technologies for optimal performance and scalability.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'React', icon: Code, color: 'from-primary-500 to-secondary-500' },
              { name: 'Tailwind', icon: Layers, color: 'from-secondary-500 to-cyan-400' },
              { name: 'Node.js', icon: Server, color: 'from-accent-500 to-rose-400' },
              { name: 'Express', icon: GitBranch, color: 'from-warm-500 to-amber-400' },
              { name: 'MongoDB', icon: Database, color: 'from-primary-500 to-violet-400' },
              { name: 'Socket.io', icon: MessageCircle, color: 'from-secondary-500 to-teal-400' },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="panel-glassmorphism p-6 text-center group hover:border-primary-500/30 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${tech.color} flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(99,102,241,0.1)] group-hover:scale-110 transition duration-500`}>
                  <tech.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-medium text-white group-hover:text-primary-400 transition">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-medium mb-4">
              <Rocket className="w-3 h-3" />
              Ecosystem
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              FuncLexa <span className="text-gradient-animated-funclexa font-extrabold">Ecosystem</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Real-world applications built as part of the FuncLexa ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredProject(idx)}
                onHoverEnd={() => setHoveredProject(null)}
                className="panel-glassmorphism p-8 group hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${project.color} flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:scale-110 transition duration-500`}>
                    <project.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition">{project.title}</h3>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-medium ${project.status === 'Live'
                        ? 'bg-success-500/20 text-success-400 border border-success-500/20'
                        : project.status === 'Beta'
                          ? 'bg-warm-500/20 text-warm-400 border border-warm-500/20'
                          : 'bg-accent-500/20 text-accent-400 border border-accent-500/20'
                      }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{project.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{project.stats}</span>
                    {project.title === 'FuncPort' ? (
                      <Link to="/app" className="text-xs text-primary-400 hover:text-primary-300 transition flex items-center gap-1 group">
                        Open Playground
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                      </Link>
                    ) : (
                      <button className="text-xs text-primary-400 hover:text-primary-300 transition flex items-center gap-1 group">
                        Learn More
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ecosystem Domain Infrastructure Mapping */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 max-w-4xl mx-auto panel-glassmorphism p-8 hover:border-primary-500/30 transition duration-500"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-400" />
              Ecosystem Domain Directory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { domain: 'funclexa.me', product: 'FuncLexa Ecosystem', desc: 'Central hub for developer resources & ecosystems.', color: 'text-indigo-400' },
                { domain: 'assets.funclexa.me', product: 'FuncLexa Assets', desc: 'Premium workspace, component library, & design tools.', color: 'text-emerald-400' },
                { domain: 'mock.funclexa.me', product: 'FuncPort Playground', desc: 'Real-time proxy routing & network testing console.', color: 'text-cyan-400' },
                { domain: 'chat.funclexa.me', product: 'LexaChat AI', desc: 'Intelligent assistant with real-time context capabilities.', color: 'text-purple-400' },
                { domain: 'flexa.funclexa.me', product: 'Flexa AI', desc: 'Multilingual conversational virtual voice agent.', color: 'text-rose-400' },
              ].map((site, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition group flex items-start justify-between">
                  <div>
                    <div className={`text-sm font-bold ${site.color} tracking-wide font-mono`}>{site.domain}</div>
                    <div className="text-xs text-white font-semibold mt-1">{site.product}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{site.desc}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition cursor-pointer" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section id="contact" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="panel-glassmorphism p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl animate-float-medium" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float-fast" />

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Launch <span className="text-gradient-animated-funclexa font-extrabold">FuncPort</span>
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-md mx-auto">
                Validate APIs, simulate failures, and test frontend resilience before deployment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/app"
                  className="relative overflow-hidden px-10 py-4 rounded-xl font-semibold text-white text-lg group inline-flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Open Playground
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>
                <a
                  href="#about"
                  className="px-10 py-4 rounded-xl border border-white/15 text-slate-300 hover:bg-white/5 transition flex items-center justify-center gap-2 text-lg group"
                >
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition" />
                  View Documentation
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-16 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="FuncLexa Logo" className="w-9 h-9 object-contain" />
                <span className="text-lg font-bold text-gradient-animated-funclexa">FuncPort</span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Part of the FuncLexa Ecosystem
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Powered by FuncLexa
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Built by Sultan Salauddin Ansari
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-slate-300 hover:text-white transition">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Projects</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-300 hover:text-white transition">LexaChat AI</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition">Flexa AI</a></li>
                <li><Link to="/app" className="text-slate-300 hover:text-white transition">FuncPort</Link></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition">FuncLexa Assets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="https://github.com/ansarisultan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                  <Github className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
                </a>
                <a href="https://x.com/ansari_sultan07" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                  <Twitter className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
                </a>
                <a href="https://www.linkedin.com/in/SultanSAnsari" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                  <Linkedin className="w-5 h-5 text-slate-300 group-hover:text-white transition" />
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                © 2024 FuncLexa. FuncPort is part of the FuncLexa ecosystem.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
