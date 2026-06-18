import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Search, Bell, Sparkles, 
  Zap, Shield, Globe, User,
  Plus, Settings, Command, Activity,
  Clock, HardDrive, Terminal, RefreshCw,
  X, Check, HelpCircle, LogOut
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import AIAssistant from '../modals/AIAssistant';
import toast from 'react-hot-toast';

export default function Topbar({ onMenuClick }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const { 
    isProxyActive, 
    setIsProxyActive,
    trafficLogs, 
    trafficStats, 
    scenarios, 
    setActiveTab, 
    loadScenario,
    clearTrafficLogs,
    setErrorCode,
    reset
  } = useStore();

  // Search filter lists
  const filteredScenarios = searchQuery 
    ? scenarios.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) 
    : [];
  const filteredLogs = searchQuery 
    ? trafficLogs.filter(l => l.route.toLowerCase().includes(searchQuery.toLowerCase()) || l.method.toLowerCase().includes(searchQuery.toLowerCase())) 
    : [];

  const triggerQuickAction = (action) => {
    setShowQuickActions(false);
    if (action === 'toggle-proxy') {
      setIsProxyActive(!isProxyActive);
      toast.success(isProxyActive ? 'Proxy configuration stopped' : 'Proxy configuration activated!');
    } else if (action === 'clear-logs') {
      clearTrafficLogs();
      toast.success('All traffic logs cleared!');
    } else if (action === 'random-error') {
      const code = ['400', '401', '403', '404', '500', '503'][Math.floor(Math.random() * 6)];
      setErrorCode(code);
      toast.success(`Error code ${code} injected!`);
    } else if (action === 'reset-all') {
      reset();
      toast.success('Configurations and store reset successfully!');
    }
  };

  return (
    <>
      <header className="h-14 flex items-center px-4 md:px-6 border-b border-white/5 bg-[#0A1020]/80 backdrop-blur-xl sticky top-0 z-30 justify-between">
        
        {/* Left Side: Mobile Menu & Product badge */}
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white transition">
            <Menu className="w-5 h-5" />
          </button>
          
          {/* FuncPort badge - Brand Aura */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 px-3 py-1 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.08)]">
            <span className="text-base md:text-lg font-black tracking-widest bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent uppercase font-mono">FuncPort</span>
            <span className="text-[8px] font-bold text-primary-400 bg-primary-400/10 px-1 rounded">V2</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-4 relative hidden sm:block">
          <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              isSearchFocused ? 'text-primary-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              placeholder="Search FuncPort proxies, scenarios, logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className={`w-full bg-[#10182D]/85 border rounded-xl pl-9 pr-14 py-1.5 text-xs text-white 
                          placeholder-slate-500 outline-none transition-all duration-300
                          ${isSearchFocused 
                            ? 'border-primary-500/50 shadow-[0_0_25px_rgba(34,211,238,0.15)]' 
                            : 'border-white/5 hover:border-white/10'
                          }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Search Dropdown Overlay */}
          {searchQuery && isSearchFocused && (
            <div className="absolute top-11 left-0 w-full bg-[#0A1020]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Search Results</span>
                <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {filteredScenarios.length === 0 && filteredLogs.length === 0 && (
                <p className="text-xs text-slate-400 py-2">No matching scenarios or logs found in FuncPort.</p>
              )}

              {filteredScenarios.length > 0 && (
                <div className="mb-4">
                  <span className="text-[10px] text-primary-400 font-semibold uppercase block mb-1">Scenarios</span>
                  <div className="space-y-1">
                    {filteredScenarios.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          navigate('/scenarios');
                          setActiveTab('scenarios');
                          loadScenario(s.id);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center justify-between transition"
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] text-slate-500">{s.latency}ms latency</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredLogs.length > 0 && (
                <div>
                  <span className="text-[10px] text-secondary-400 font-semibold uppercase block mb-1">Traffic Logs</span>
                  <div className="space-y-1">
                    {filteredLogs.slice(0, 5).map(l => (
                      <button
                        key={l.id}
                        onClick={() => {
                          navigate('/logs');
                          setActiveTab('traffic');
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center justify-between transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            l.status < 400 ? 'bg-success-500/20 text-success-400' : 'bg-danger-500/20 text-danger-400'
                          }`}>
                            {l.status}
                          </span>
                          <span className="font-mono text-slate-400">{l.method}</span>
                          <span className="truncate">{l.route}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{l.responseTime}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 relative">
          
          {/* Stats Bar */}
          <div className="hidden md:flex items-center gap-3 text-[10px] text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-primary-400" />
              {trafficLogs.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-success-400" />
              {trafficStats.avgResponseTime || 0}ms
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-accent-400" />
              {isProxyActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* AI Assistant */}
          <button 
            onClick={() => setShowAIAssistant(true)}
            className="p-2 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 hover:from-primary-500/30 hover:to-secondary-500/30 transition border border-white/10 hover:scale-105 duration-300 group relative"
            title="FuncPort AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-gradient-cyber group-hover:animate-spin-slow" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </button>

          {/* Quick Actions (Zap Button) */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowQuickActions(!showQuickActions);
                setShowProfileMenu(false);
                setShowShortcuts(false);
              }}
              className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-105 ${showQuickActions ? 'bg-white/5 text-warm-400' : 'text-slate-400'}`}
              title="Quick Operations"
            >
              <Zap className="w-4 h-4 hover:text-warm-400 transition" />
            </button>
            {showQuickActions && (
              <div className="absolute right-0 top-11 w-48 bg-[#0A1020]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-[0_10px_45px_rgba(0,0,0,0.6)] z-50 space-y-1">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block px-2 mb-1">Quick Actions</span>
                <button onClick={() => triggerQuickAction('toggle-proxy')} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-primary-400" />
                  {isProxyActive ? 'Stop Proxy' : 'Start Proxy'}
                </button>
                <button onClick={() => triggerQuickAction('clear-logs')} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-secondary-400" />
                  Clear Traffic Logs
                </button>
                <button onClick={() => triggerQuickAction('random-error')} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-accent-400" />
                  Inject Random Error
                </button>
                <button onClick={() => triggerQuickAction('reset-all')} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-xs text-danger-400 flex items-center gap-2 border-t border-white/5 pt-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Dialog */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowShortcuts(!showShortcuts);
                setShowQuickActions(false);
                setShowProfileMenu(false);
              }}
              className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-105 hidden sm:flex ${showShortcuts ? 'bg-white/5 text-white' : 'text-slate-400'}`}
              title="Keyboard Shortcuts"
            >
              <Command className="w-4 h-4 hover:text-white transition" />
            </button>
            {showShortcuts && (
              <div className="absolute right-0 top-11 w-64 bg-[#0A1020]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_45px_rgba(0,0,0,0.6)] z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Shortcuts</span>
                  <button onClick={() => setShowShortcuts(false)} className="text-slate-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Search bar focus</span>
                    <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[10px] font-mono">⌘K</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Toggle Left Panel</span>
                    <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[10px] font-mono">⌘B</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>AI Chat Modal</span>
                    <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[10px] font-mono">⌘J</kbd>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Fullscreen view</span>
                    <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[10px] font-mono">F11</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <div 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowQuickActions(false);
                setShowShortcuts(false);
              }}
              className="w-8 h-8 rounded-xl bg-gradient-main flex items-center justify-center text-white text-xs font-bold shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-105 duration-300 cursor-pointer"
            >
              M
            </div>
            {/* {showProfileMenu && (
              <div className="absolute right-0 top-11 w-48 bg-[#0A1020]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 shadow-[0_10px_45px_rgba(0,0,0,0.6)] z-50 space-y-1">
                <div className="px-2.5 py-1 border-b border-white/5 mb-1 text-left">
                  <span className="text-[10px] text-slate-400 font-semibold block">Dev Admin</span>
                  <span className="text-[9px] text-slate-500 block truncate">admin@funclexa.com</span>
                </div>
                <button onClick={() => { setShowProfileMenu(false); navigate('/'); setActiveTab('config'); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-primary-400" />
                  Proxy Config
                </button>
                <button onClick={() => { setShowProfileMenu(false); toast.success('Help Center opened'); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-secondary-400" />
                  Documentation
                </button>
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    reset();
                    toast.success('Logged out successfully');
                  }} 
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-danger-500/10 hover:text-danger-400 text-xs text-slate-200 flex items-center gap-2 border-t border-white/5 pt-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Reset Session
                </button>
              </div>
            )} */}
          </div>

        </div>
      </header>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
    </>
  );
}
