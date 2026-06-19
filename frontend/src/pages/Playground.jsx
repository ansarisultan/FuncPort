import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useProxy } from '../hooks/useProxy';
import { useTraffic } from '../hooks/useTraffic';
import ProxyConfig from '../components/panels/ProxyConfig';
import NetworkControls from '../components/panels/NetworkControls';
import TrafficInspector from '../components/panels/TrafficInspector';
import ScenarioManager from '../components/panels/ScenarioManager';
import StressTest from '../components/panels/StressTest';
import { DummyDataGeneratorConfig, DummyDataGeneratorPreview } from '../components/panels/DummyDataGenerator';
import { 
  SplitSquareHorizontal, Maximize2, Minimize2,
  Activity, Settings, Network, FileText,
  ChevronLeft, ChevronRight, Loader2,
  Zap, Sparkles, Shield, Globe, Clock,
  AlertCircle, Database, Upload, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Playground() {
  const { 
    activeTab, 
    setActiveTab, 
    isProxyActive, 
    setIsFullscreen, 
    isFullscreen,
    latency,
    failureRate,
    errorCode,
    trafficStats
  } = useStore();
  
  // Call useProxy to ensure dynamic configuration sync effect remains mounted & active at all times
  useProxy();

  const navigate = useNavigate();
  const { trafficLogs } = useTraffic();
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isPlaceholderCollapsed, setIsPlaceholderCollapsed] = useState(false);
  const location = useLocation();

  const getLeftColSpanClass = () => {
    if (activeTab === 'traffic') return 'hidden';
    if (!isLeftPanelOpen) return 'hidden';
    if (isPlaceholderCollapsed && !isProxyActive && activeTab !== 'traffic' && activeTab !== 'generator') {
      const showRightPanel = isRightPanelOpen && activeTab !== 'traffic' && activeTab !== 'generator';
      return showRightPanel ? 'lg:col-span-9' : 'lg:col-span-12';
    }
    return 'lg:col-span-4';
  };

  const getCenterColSpanClass = () => {
    if (activeTab === 'traffic') return 'lg:col-span-12';
    const showPlaceholder = !isProxyActive && activeTab !== 'traffic' && activeTab !== 'generator';
    if (showPlaceholder && isPlaceholderCollapsed) return 'hidden';
    
    let s = 12;
    if (isLeftPanelOpen) s -= 4;
    const showRightPanel = isRightPanelOpen && activeTab !== 'traffic' && activeTab !== 'generator' && !isProxyActive;
    if (showRightPanel) s -= 3;
    
    if (s === 12) return 'lg:col-span-12';
    if (s === 9) return 'lg:col-span-9';
    if (s === 8) return 'lg:col-span-8';
    return 'lg:col-span-5';
  };

  const handleExportBackup = () => {
    try {
      const state = useStore.getState();
      const backupData = {
        backendUrl: state.backendUrl,
        proxyUrl: state.proxyUrl,
        proxyId: state.proxyId,
        isProxyActive: state.isProxyActive,
        latency: state.latency,
        errorCode: state.errorCode,
        failureRate: state.failureRate,
        rateLimit: state.rateLimit,
        networkProfile: state.networkProfile,
        payloadMultiplier: state.payloadMultiplier,
        schemaMutations: state.schemaMutations,
        scenarios: state.scenarios,
        trafficLogs: state.trafficLogs,
        trafficStats: state.trafficStats,
        webhookUrl: state.webhookUrl,
        isWebhookEnabled: state.isWebhookEnabled,
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `funcport-backup-${new Date().toISOString().slice(0, 10)}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast.success('Backup file exported successfully!');
    } catch (err) {
      toast.error('Failed to export backup: ' + err.message);
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (typeof data !== 'object') {
          throw new Error('Invalid JSON format.');
        }

        // Restore into Zustand store
        useStore.setState({
          backendUrl: data.backendUrl || '',
          proxyUrl: data.proxyUrl || '',
          proxyId: data.proxyId || null,
          isProxyActive: data.isProxyActive || false,
          latency: data.latency || 0,
          errorCode: data.errorCode || 'none',
          failureRate: data.failureRate || 0,
          rateLimit: data.rateLimit || 'none',
          networkProfile: data.networkProfile || 'custom',
          payloadMultiplier: data.payloadMultiplier || 1,
          schemaMutations: data.schemaMutations || {
            removeFields: [],
            renameFields: {},
            returnNull: [],
            emptyArrays: [],
            changeTypes: {},
          },
          scenarios: data.scenarios || [],
          trafficLogs: data.trafficLogs || [],
          trafficStats: data.trafficStats || { total: 0, success: 0, errors: 0, avgResponseTime: 0, requestsPerSecond: 0 },
          webhookUrl: data.webhookUrl || '',
          isWebhookEnabled: data.isWebhookEnabled || false,
        });

        // Sync to backend proxy if active
        if (data.isProxyActive && data.proxyId && data.backendUrl) {
          try {
            await axios.post(`${API_BASE_URL}/api/proxy/create`, {
              backendUrl: data.backendUrl,
              networkConfig: {
                latency: data.latency || 0,
                errorCode: data.errorCode || 'none',
                failureRate: data.failureRate || 0,
                rateLimit: data.rateLimit || 'none',
                networkProfile: data.networkProfile || 'custom',
                payloadMultiplier: data.payloadMultiplier || 1,
              },
              schemaMutations: data.schemaMutations || {}
            });
          } catch (backendErr) {
            console.error('Failed to register/sync proxy on backend during import:', backendErr);
          }
        }

        toast.success('Backup file imported successfully!');
      } catch (err) {
        toast.error('Failed to parse backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [
    { id: 'config', label: 'Configuration', icon: Settings, to: '/' },
    { id: 'network', label: 'Network Controls', icon: Network, to: '/' },
    { id: 'traffic', label: 'Traffic Inspector', icon: Activity, to: '/logs' },
    { id: 'scenarios', label: 'Scenarios', icon: FileText, to: '/scenarios' },
    { id: 'stress', label: 'Stress Test', icon: Loader2, to: '/stress' },
    { id: 'generator', label: 'Data Generator', icon: Database, to: '/generator' },
  ];

  useEffect(() => {
    if (location.pathname === '/scenarios') {
      setActiveTab('scenarios');
    } else if (location.pathname === '/logs') {
      setActiveTab('traffic');
    } else if (location.pathname === '/stress') {
      setActiveTab('stress');
    } else if (location.pathname === '/generator') {
      setActiveTab('generator');
    } else if (location.pathname === '/') {
      if (activeTab !== 'network' && activeTab !== 'config') {
        setActiveTab('config');
      }
    }
  }, [location.pathname, setActiveTab]);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'config': return <ProxyConfig />;
      case 'network': return <NetworkControls />;
      case 'scenarios': return <ScenarioManager />;
      case 'traffic': return <TrafficInspector />;
      case 'stress': return <StressTest />;
      case 'generator': return <DummyDataGeneratorConfig />;
      default: return <ProxyConfig />;
    }
  };

  return (
    <div className={`w-full flex flex-col relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-[#050816] p-4 h-screen' : 'h-full lg:h-[calc(100vh-5.5rem)] lg:overflow-hidden'}`}>
      {/* Background Grid Pattern & Radial Glows */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40 z-0" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/3 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="flex flex-col h-full gap-4 z-10 relative">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0A1020] border border-[#1E293B]/60 p-4 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#06B6D4]/5 rounded-full blur-3xl animate-float-slow" />
          
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-3">
                <Network className="w-5 h-5 text-[#06B6D4]" />
                <span className="text-gradient-animated-funclexa">FuncPort Playground</span>
                {isProxyActive && (
                  <span className="text-xs font-normal text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20 flex items-center gap-2 animate-pulse">
                    <Activity className="w-3 h-3" />
                    Active
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#06B6D4]" />
                FuncPort Network Simulator • {trafficLogs.length} requests logged
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBackup}
                className="btn-3d flex items-center gap-1.5 text-xs px-3 py-2"
                title="Export JSON Backup"
              >
                <Download className="w-3.5 h-3.5" />
                Export Backup
              </button>
              <label className="btn-3d flex items-center gap-1.5 text-xs px-3 py-2 cursor-pointer" title="Import JSON Backup">
                <Upload className="w-3.5 h-3.5" />
                Import Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Infrastructure Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Card 1: Latency */}
          <div className="panel-3d p-3 flex flex-col justify-between h-20 bg-[#0A1020] border-[#1E293B]/60 hover:border-[#F59E0B]/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">LATENCY</span>
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            </div>
            <div className="flex items-end justify-between mt-1">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold font-mono text-[#F59E0B]">{latency}</span>
                <span className="text-[10px] text-slate-500 font-mono">ms</span>
              </div>
              <svg className="w-14 h-5 text-[#F59E0B]/50" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0,25 L10,22 L20,28 L30,15 L40,18 L50,10 L60,25 L70,8 L80,12 L90,5 L100,15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 2: Fail Rate */}
          <div className="panel-3d p-3 flex flex-col justify-between h-20 bg-[#0A1020] border-[#1E293B]/60 hover:border-[#EF4444]/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">FAIL RATE</span>
              <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            </div>
            <div className="flex items-end justify-between mt-1">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold font-mono text-[#EF4444]">{failureRate}</span>
                <span className="text-[10px] text-slate-500 font-mono">%</span>
              </div>
              <svg className="w-14 h-5 text-[#EF4444]/50" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0,28 L10,28 L20,28 L30,22 L40,28 L50,28 L60,15 L70,28 L80,28 L90,20 L100,28" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: Error Inject */}
          <div className="panel-3d p-3 flex flex-col justify-between h-20 bg-[#0A1020] border-[#1E293B]/60 hover:border-red-500/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ERROR INJECT</span>
              <Shield className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className={`text-xs font-bold font-mono truncate ${errorCode !== 'none' ? 'text-[#EF4444]' : 'text-slate-400'}`}>
                {errorCode === 'none' ? 'NONE' : errorCode}
              </span>
              <div className={`w-2 h-2 rounded-full ${errorCode !== 'none' ? 'bg-[#EF4444] animate-pulse' : 'bg-slate-700'}`} />
            </div>
          </div>

          {/* Card 4: Throughput */}
          <div className="panel-3d p-3 flex flex-col justify-between h-20 bg-[#0A1020] border-[#1E293B]/60 hover:border-[#06B6D4]/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">TRAFFIC</span>
              <Activity className="w-3.5 h-3.5 text-[#06B6D4]" />
            </div>
            <div className="flex items-end justify-between mt-1">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold font-mono text-[#06B6D4]">{trafficLogs.length}</span>
                <span className="text-[10px] text-slate-500 font-mono">reqs</span>
              </div>
              <svg className="w-14 h-5 text-[#06B6D4]/50" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0,28 Q15,5 30,25 T60,10 T90,20 L100,5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 5: Proxy State */}
          <div className="panel-3d p-3 flex flex-col justify-between h-20 bg-[#0A1020] border-[#1E293B]/60 hover:border-[#22C55E]/30 transition-all duration-300 col-span-2 sm:col-span-1">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">PROXY STATE</span>
              <Globe className="w-3.5 h-3.5 text-[#22C55E]" />
            </div>
            <div className="flex items-end justify-between mt-1">
              <span className={`text-xs font-bold font-mono uppercase ${isProxyActive ? 'text-[#22C55E]' : 'text-slate-500'}`}>
                {isProxyActive ? 'ACTIVE' : 'STANDBY'}
              </span>
              <span className={`relative flex h-2 w-2`}>
                {isProxyActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isProxyActive ? 'bg-[#22C55E]' : 'bg-slate-600'}`}></span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#0A1020] rounded-xl p-1 border border-[#1E293B]/60 w-full lg:w-fit overflow-x-auto no-scrollbar scrollbar-none flex-nowrap lg:flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.to);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 lg:overflow-hidden relative">
          {/* Left Panel Toggle */}
          <button
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-r-xl bg-[#0A1020] border border-[#1E293B]/60 hover:border-white/10 transition"
          >
            {isLeftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
 
          {/* Left Panel */}
          {isLeftPanelOpen && activeTab !== 'traffic' && (
            <div className={`${getLeftColSpanClass()} space-y-4 overflow-y-auto pr-2 h-full pb-8 lg:pb-0 transition-all duration-300`}>
              {isPlaceholderCollapsed && !isProxyActive && activeTab !== 'traffic' && activeTab !== 'generator' && (
                <div className="p-3 bg-primary-500/10 border border-[#1E293B]/60 rounded-xl flex items-center justify-between text-xs text-slate-300 mb-4 animate-slide-up">
                  <span className="flex items-center gap-2">
                    <SplitSquareHorizontal className="w-4 h-4 text-primary-400" />
                    <span>Workspace center is collapsed. Panel is expanded.</span>
                  </span>
                  <button
                    onClick={() => setIsPlaceholderCollapsed(false)}
                    className="px-2 py-1 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 font-semibold border border-primary-500/30 transition-all text-xs"
                  >
                    Restore Workspace
                  </button>
                </div>
              )}
              {renderTabContent()}
            </div>
          )}
 
          {/* Center - Traffic or Placeholder */}
          <div className={`${getCenterColSpanClass()} h-full flex flex-col min-h-[400px] lg:min-h-0 transition-all duration-300 ${activeTab === 'traffic' || activeTab === 'generator' ? 'block' : 'hidden lg:block'}`}>
            {activeTab === 'traffic' || (isProxyActive && activeTab !== 'generator') ? (
              <TrafficInspector />
            ) : activeTab === 'generator' ? (
                <DummyDataGeneratorPreview />
            ) : (
              <div className="panel-3d h-full p-6 flex flex-col items-center justify-center bg-[#0A1020]/40 relative overflow-hidden group border-[#1E293B]/60">
                <button
                  onClick={() => setIsPlaceholderCollapsed(true)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition border border-[#1E293B]/60 hover:scale-105 duration-300 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                  title="Collapse workspace placeholder and expand settings"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Collapse & Expand Panel</span>
                </button>
 
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Network className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400">Configure your proxy to start testing</p>
                  <p className="text-xs text-slate-500 mt-1">Enter a backend URL and generate a proxy</p>
                  {!isProxyActive && (
                    <button
                      onClick={() => setActiveTab('config')}
                      className="mt-4 btn-3d text-sm px-4 py-2"
                    >
                      <Zap className="w-4 h-4 inline mr-2" />
                      Start Configuration
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
 
          {/* Right Panel Toggle */}
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-l-xl bg-[#0A1020] border border-[#1E293B]/60 hover:border-white/10 transition"
          >
            {isRightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
 
          {/* Right Panel - Traffic Mini */}
          {isRightPanelOpen && activeTab !== 'traffic' && activeTab !== 'generator' && !isProxyActive && (
            <div className="hidden lg:block lg:col-span-3 panel-3d p-4 overflow-y-auto bg-[#0A1020]/90 h-full">
              <TrafficInspector mini />
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isProxyActive ? 'bg-success-400 animate-pulse' : 'bg-slate-600'}`} />
              {isProxyActive ? 'Proxy Active' : 'Proxy Inactive'}
            </span>
            <span>•</span>
            <span>{trafficLogs.length} requests</span>
            <span>•</span>
            <span>v2.0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary-400 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              mock.funclexa.com
            </span>
            <span className="text-slate-600">|</span>
            <span>FuncPort Network Environment Playground</span>
          </div>
        </div>
      </div>
    </div>
  );
}
