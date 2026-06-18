import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Network, Settings, FileText, Activity, 
  Zap, Sparkles, Shield, Globe,
  Plus, FolderOpen, Clock, BarChart3,
  ChevronDown, ChevronRight, Cpu,
  Loader2, Terminal, GitBranch, Database
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { to: '/', label: 'Playground', icon: Network },
  { to: '/scenarios', label: 'Scenarios', icon: FolderOpen },
  { to: '/logs', label: 'Traffic Logs', icon: Activity },
  { to: '/stress', label: 'Stress Test', icon: Loader2 },
  { to: '/generator', label: 'Data Generator', icon: Database },
];

export default function Sidebar({ onClose }) {
  const { scenarios, isProxyActive, trafficLogs, setActiveTab, loadScenario } = useStore();
  const [showProjects, setShowProjects] = useState(true);
  const navigate = useNavigate();

  return (
    <aside className="h-full flex flex-col py-4 px-3 bg-[#0A1020]/95 backdrop-blur-2xl border-r border-white/5 shadow-2xl">
      {/* Brand - FuncLexa Style */}
     <div className="flex items-center gap-3 px-3 mb-8 preserve-3d">
        <img src="/logo.png" alt="FuncLexa Logo" className="w-12 h-12 object-contain flex-shrink-0" />
        <div>
          <span className="text-4xl font-bold text-gradient-animated-funclexa block leading-none">FuncLexa</span>
          <span className="text-[10px] font-normal text-slate-400 tracking-wider uppercase mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-ping" />
            FuncPort • Network
          </span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-3 mb-4 flex items-center gap-2 text-[10px]">
        <div className={`w-1.5 h-1.5 rounded-full ${isProxyActive ? 'bg-success-400 animate-pulse' : 'bg-slate-600'}`} />
        <span className="text-slate-400">{isProxyActive ? 'Proxy Active' : 'Proxy Inactive'}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">{trafficLogs.length} requests</span>
      </div>

      {/* Main nav */}
      <nav className="space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-white/5" />

      {/* Scenarios section */}
      <div className="space-y-1">
        <button
          onClick={() => setShowProjects(!showProjects)}
          className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider hover:text-white transition w-full"
        >
          {showProjects ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Saved Scenarios
          <span className="ml-auto text-[10px] text-slate-500">{scenarios.length}</span>
        </button>
        
        {showProjects && (
          <div className="space-y-1 pl-2">
            {scenarios.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500">
                No scenarios saved
              </div>
            ) : (
              scenarios.slice(0, 5).map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    navigate('/');
                    setActiveTab('scenarios');
                    loadScenario(scenario.id);
                    if (onClose) onClose();
                  }}
                  className="sidebar-item w-full text-left text-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span className="truncate">{scenario.name}</span>
                  {scenario.isActive && (
                    <span className="text-[8px] text-success-400 bg-success-500/20 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </button>
              ))
            )}
            {scenarios.length > 5 && (
              <button className="text-[10px] text-primary-400 hover:text-primary-300 px-3 py-1">
                View all ({scenarios.length})
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Quick Actions */}
      <div className="px-3 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium flex items-center gap-2">
          <Zap className="w-3 h-3" />
          Quick Actions
        </span>
        <button 
          onClick={() => {
            navigate('/');
            setActiveTab('config');
            if (onClose) onClose();
          }}
          className="sidebar-item w-full text-left text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          New Proxy
        </button>
        <button 
          onClick={() => {
            navigate('/scenarios');
            setActiveTab('scenarios');
            if (onClose) onClose();
          }}
          className="sidebar-item w-full text-left text-xs"
        >
          <GitBranch className="w-3.5 h-3.5" />
          Clone Scenario
        </button>
        <button 
          onClick={() => {
            navigate('/logs');
            setActiveTab('traffic');
            if (onClose) onClose();
          }}
          className="sidebar-item w-full text-left text-xs"
        >
          <Terminal className="w-3.5 h-3.5" />
          View Logs
        </button>
      </div>

      {/* Footer */}
      <div className="px-3 pt-2 mt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
            <span>System Ready</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Shield className="w-3 h-3" />
            <span>v2.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
