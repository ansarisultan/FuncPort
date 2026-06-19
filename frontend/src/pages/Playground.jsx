import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  const { trafficLogs } = useTraffic();
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isPlaceholderCollapsed, setIsPlaceholderCollapsed] = useState(false);
  const location = useLocation();

  const getLeftColSpanClass = () => {
    if (!isLeftPanelOpen) return 'hidden';
    if (isPlaceholderCollapsed && !isProxyActive && activeTab !== 'traffic' && activeTab !== 'generator') {
      const showRightPanel = isRightPanelOpen && activeTab !== 'traffic' && activeTab !== 'generator';
      return showRightPanel ? 'lg:col-span-9' : 'lg:col-span-12';
    }
    return 'lg:col-span-4';
  };

  const getCenterColSpanClass = () => {
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
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'network', label: 'Network Controls', icon: Network },
    { id: 'traffic', label: 'Traffic Inspector', icon: Activity },
    { id: 'scenarios', label: 'Scenarios', icon: FileText },
    { id: 'stress', label: 'Stress Test', icon: Loader2 },
    { id: 'generator', label: 'Data Generator', icon: Database },
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
      setActiveTab('config');
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
    <div className={`w-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-[#050816] p-4 h-screen' : 'h-full lg:h-[calc(100vh-5.5rem)] lg:overflow-hidden'}`}>
      <div className="flex flex-col h-full gap-4">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-transparent border border-white/5 p-4 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-500/10 rounded-full blur-3xl animate-float-medium" />
          
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-3">
                <Network className="w-5 h-5 text-primary-400" />
                <span className="text-gradient-animated-funclexa">FuncPort Playground</span>
                {isProxyActive && (
                  <span className="text-xs font-normal text-success-400 bg-success-500/20 px-3 py-1 rounded-full border border-success-500/20 flex items-center gap-2 animate-pulse">
                    <Activity className="w-3 h-3" />
                    Active
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary-400" />
                FuncPort Network Simulator • {trafficLogs.length} requests logged
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBackup}
                className="btn-3d flex items-center gap-1.5 text-xs px-3 py-2 bg-white/5 border-white/5 hover:bg-white/10"
                title="Export JSON Backup"
              >
                <Download className="w-3.5 h-3.5" />
                Export Backup
              </button>
              <label className="btn-3d flex items-center gap-1.5 text-xs px-3 py-2 bg-white/5 border-white/5 hover:bg-white/10 cursor-pointer" title="Import JSON Backup">
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

        {/* Real-time Infrastructure Widgets - Ultra-compact Developer Grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <div className="panel-3d py-1.5 px-2.5 flex items-center justify-between bg-[#0A1020]/90 border-white/5 hover:border-primary-500/10 transition-all duration-300">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Latency</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold font-mono text-[#22D3EE]">{latency}</span>
                <span className="text-[9px] text-slate-500">ms</span>
              </div>
            </div>
            <Clock className="w-4 h-4 text-[#22D3EE]/60 flex-shrink-0" />
          </div>

          <div className="panel-3d py-1.5 px-2.5 flex items-center justify-between bg-[#0A1020]/90 border-white/5 hover:border-danger-500/10 transition-all duration-300">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Fail Rate</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold font-mono text-[#EF4444]">{failureRate}</span>
                <span className="text-[9px] text-slate-500">%</span>
              </div>
            </div>
            <AlertCircle className="w-4 h-4 text-[#EF4444]/60 flex-shrink-0" />
          </div>

          <div className="panel-3d py-1.5 px-2.5 flex items-center justify-between bg-[#0A1020]/90 border-white/5 hover:border-accent-500/10 transition-all duration-300">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Error Inject</span>
              <span className={`text-xs font-bold font-mono block mt-0.5 ${errorCode !== 'none' ? 'text-[#EF4444]' : 'text-slate-400'}`}>
                {errorCode === 'none' ? 'None' : errorCode}
              </span>
            </div>
            <Shield className="w-4 h-4 text-[#6366F1]/60 flex-shrink-0" />
          </div>

          <div className="panel-3d py-1.5 px-2.5 flex items-center justify-between bg-[#0A1020]/90 border-white/5 hover:border-secondary-500/10 transition-all duration-300">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Traffic</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold font-mono text-[#3B82F6]">{trafficStats?.total || 0}</span>
                <span className="text-[9px] text-slate-500">reqs</span>
              </div>
            </div>
            <Activity className="w-4 h-4 text-[#3B82F6]/60 flex-shrink-0" />
          </div>

          <div className="panel-3d py-1.5 px-2.5 flex items-center justify-between bg-[#0A1020]/90 border-white/5 hover:border-success-500/10 transition-all duration-300 col-span-2 sm:col-span-1">
            <div className="min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider block">Proxy</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isProxyActive ? 'bg-[#22C55E] animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-xs font-bold text-white uppercase truncate">
                  {isProxyActive ? 'Active' : 'Standby'}
                </span>
              </div>
            </div>
            <Globe className="w-4 h-4 text-[#22C55E]/60 flex-shrink-0" />
          </div>
        </div>
        */}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#0A1020] rounded-xl p-1 border border-white/5 w-fit flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 lg:overflow-hidden">
          {/* Left Panel Toggle */}
          <button
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-r-xl bg-[#0A1020] border border-white/5 hover:border-white/10 transition"
          >
            {isLeftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Left Panel */}
          {isLeftPanelOpen && (
            <div className={`${getLeftColSpanClass()} space-y-4 overflow-y-auto pr-2 h-full pb-8 lg:pb-0 transition-all duration-300`}>
              {isPlaceholderCollapsed && !isProxyActive && activeTab !== 'traffic' && activeTab !== 'generator' && (
                <div className="p-3 bg-primary-500/10 border border-white/5 rounded-xl flex items-center justify-between text-xs text-slate-300 mb-4 animate-slide-up">
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
          <div className={`${getCenterColSpanClass()} h-full flex flex-col min-h-[400px] lg:min-h-0 transition-all duration-300`}>
            {activeTab === 'traffic' || (isProxyActive && activeTab !== 'generator') ? (
              <TrafficInspector />
            ) : activeTab === 'generator' ? (
              <DummyDataGeneratorPreview />
            ) : (
              <div className="panel-3d h-full p-6 flex flex-col items-center justify-center bg-[#0A1020]/40 relative overflow-hidden group border-white/5">
                <button
                  onClick={() => setIsPlaceholderCollapsed(true)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5 hover:scale-105 duration-300 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
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
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-l-xl bg-[#0A1020] border border-white/5 hover:border-white/10 transition"
          >
            {isRightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Right Panel - Traffic Mini */}
          {isRightPanelOpen && activeTab !== 'traffic' && activeTab !== 'generator' && !isProxyActive && (
            <div className="lg:col-span-3 panel-3d p-4 overflow-y-auto bg-[#0A1020]/90 h-full">
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
