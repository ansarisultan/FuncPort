import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  FolderOpen, Plus, Save, Trash2, 
  Play, Clock, Settings, Copy,
  Check, X, Edit, Download, Upload
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

export default function ScenarioManager() {
  const { 
    scenarios, 
    loadScenario,
    activeScenario,
    latency,
    errorCode,
    failureRate,
    rateLimit,
    networkProfile,
    payloadMultiplier,
    schemaMutations
  } = useStore();

  const [isCreating, setIsCreating] = useState(false);
  const [scenarioName, setScenarioName] = useState('');

  // Built-in presets
  const presets = [
    {
      name: 'Cloudflare Edge Outage',
      description: 'Simulates complete gateway failure with 502 Bad Gateway response codes.',
      latency: 120,
      errorCode: '502',
      failureRate: 100,
      networkProfile: 'custom'
    },
    {
      name: 'Slow Rural Mobile Link (3G)',
      description: 'High latency connection with minor intermittent packet drops.',
      latency: 900,
      errorCode: 'none',
      failureRate: 8,
      networkProfile: '3g'
    },
    {
      name: 'API Rate Limiting Thrashing',
      description: 'Simulates rate limit errors returned from proxy during peak traffic cycles.',
      latency: 40,
      errorCode: '429',
      failureRate: 40,
      networkProfile: 'fast-wifi'
    },
    {
      name: 'Intermittent Database Timeout',
      description: 'Extremely slow queries ending in gateway timeouts (504).',
      latency: 4500,
      errorCode: '504',
      failureRate: 15,
      networkProfile: 'custom'
    }
  ];

  // Fetch scenarios
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/scenarios`);
        if (response.data && response.data.success) {
          const normalized = response.data.scenarios.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description || '',
            latency: s.networkConfig?.latency ?? 0,
            errorCode: s.networkConfig?.errorCode ?? 'none',
            failureRate: s.networkConfig?.failureRate ?? 0,
            rateLimit: s.networkConfig?.rateLimit ?? 'none',
            networkProfile: s.networkConfig?.networkProfile ?? 'custom',
            payloadMultiplier: s.networkConfig?.payloadMultiplier ?? 1,
            schemaMutations: s.schemaMutations || {},
            createdAt: s.createdAt,
          }));
          useStore.setState({ scenarios: normalized });
        }
      } catch (err) {
        console.error('Failed to load scenarios:', err);
      }
    };
    fetchScenarios();
  }, []);

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/scenarios`, {
        name: scenarioName,
        description: `Custom scenario saved at ${new Date().toLocaleTimeString()}`,
        networkConfig: {
          latency,
          errorCode,
          failureRate,
          rateLimit,
          networkProfile,
          payloadMultiplier,
        },
        schemaMutations,
        isActive: false
      });

      if (response.data && response.data.success) {
        const s = response.data.scenario;
        const normalized = {
          id: s.id,
          name: s.name,
          description: s.description || '',
          latency: s.networkConfig?.latency ?? 0,
          errorCode: s.networkConfig?.errorCode ?? 'none',
          failureRate: s.networkConfig?.failureRate ?? 0,
          rateLimit: s.networkConfig?.rateLimit ?? 'none',
          networkProfile: s.networkConfig?.networkProfile ?? 'custom',
          payloadMultiplier: s.networkConfig?.payloadMultiplier ?? 1,
          schemaMutations: s.schemaMutations || {},
          createdAt: s.createdAt,
        };
        
        useStore.setState((state) => ({
          scenarios: [...state.scenarios, normalized]
        }));
        setScenarioName('');
        setIsCreating(false);
        toast.success('Scenario saved successfully!');
      }
    } catch (err) {
      toast.error('Failed to save scenario');
    }
  };

  const handleApplyPreset = async (preset) => {
    try {
      useStore.setState({
        latency: preset.latency,
        errorCode: preset.errorCode,
        failureRate: preset.failureRate,
        networkProfile: preset.networkProfile
      });

      const activeProxyId = useStore.getState().proxyId;
      if (activeProxyId) {
        await axios.put(`${API_BASE_URL}/api/proxy/${activeProxyId}`, {
          networkConfig: {
            latency: preset.latency,
            errorCode: preset.errorCode,
            failureRate: preset.failureRate,
            networkProfile: preset.networkProfile,
            rateLimit: useStore.getState().rateLimit || 'none',
            payloadMultiplier: useStore.getState().payloadMultiplier || 1
          },
          schemaMutations: useStore.getState().schemaMutations
        });
      }
      toast.success(`Preset "${preset.name}" applied successfully!`);
    } catch (err) {
      toast.error('Failed to apply preset');
    }
  };

  const handleLoadScenario = async (id) => {
    loadScenario(id);
    const activeProxyId = useStore.getState().proxyId;
    if (activeProxyId) {
      try {
        await axios.post(`${API_BASE_URL}/api/scenarios/${id}/apply/${activeProxyId}`);
        toast.success('Scenario applied to active proxy!');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteScenario = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/scenarios/${id}`);
      if (response.data && response.data.success) {
        useStore.setState((state) => ({
          scenarios: state.scenarios.filter(s => s.id !== id)
        }));
        if (activeScenario === id) {
          loadScenario(null);
        }
        toast.success('Scenario deleted');
      }
    } catch (err) {
      toast.error('Failed to delete scenario');
    }
  };

  const handleCloneScenario = (scenario) => {
    setScenarioName(`${scenario.name} (Copy)`);
    setIsCreating(true);
    toast.success('Scenario details copied to form!');
  };

  const getProfileLabel = (profile) => {
    const profiles = {
      'custom': 'Custom',
      'fast-wifi': 'Fast WiFi',
      '4g': '4G',
      '3g': '3G',
      '2g': '2G',
      'satellite': 'Satellite',
    };
    return profiles[profile] || profile;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto h-full pr-1 pb-6">
      {/* Left Column: Saved Scenarios & Controls */}
      <div className="lg:col-span-7 space-y-4">
        <div className="panel-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-primary-400" />
              Saved Network Scenarios
            </h3>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-3d flex items-center gap-1.5 text-xs px-3 py-1.5 animate-pulse-glow"
            >
              <Plus className="w-3.5 h-3.5" />
              Save Current State
            </button>
          </div>

          {/* Create Scenario */}
          {isCreating && (
            <div className="p-4 bg-[#050816] rounded-xl border border-[#1E293B] space-y-3 animate-slide-up">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Scenario Label</label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="Enter name (e.g. Test Slow Endpoint)..."
                  className="input-premium w-full text-xs"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSaveScenario}
                  disabled={!scenarioName.trim()}
                  className="btn-3d text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setScenarioName('');
                  }}
                  className="btn-3d-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Scenarios List */}
          {scenarios.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400 font-semibold">No Custom Scenarios</p>
              <p className="text-xs text-slate-500 mt-1">Configure proxy settings and save them for instant recovery.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {scenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 ${
                    activeScenario === scenario.id
                      ? 'bg-primary-500/10 border-primary-500/35'
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {scenario.name}
                        </span>
                        {activeScenario === scenario.id && (
                          <span className="text-[8px] font-bold text-success-400 bg-success-500/15 px-1.5 py-0.5 rounded border border-success-500/20">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#F59E0B]" />
                          {scenario.latency}ms
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings className="w-3 h-3 text-[#EF4444]" />
                          {scenario.errorCode === 'none' ? 'No Error' : scenario.errorCode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Copy className="w-3 h-3 text-[#06B6D4]" />
                          {scenario.failureRate}% failures
                        </span>
                        <span className="text-slate-500">
                          {getProfileLabel(scenario.networkProfile)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleLoadScenario(scenario.id)}
                        className="p-1.5 rounded hover:bg-white/5 transition text-slate-400 hover:text-success-400"
                        title="Load Scenario"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCloneScenario(scenario)}
                        className="p-1.5 rounded hover:bg-white/5 transition text-slate-400 hover:text-[#06B6D4]"
                        title="Clone Scenario"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteScenario(scenario.id)}
                        className="p-1.5 rounded hover:bg-white/5 transition text-slate-400 hover:text-accent-400"
                        title="Delete Scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Interactive Templates */}
      <div className="lg:col-span-5 space-y-4">
        <div className="panel-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#06B6D4]" />
              Preset Templates
            </h3>
            <span className="text-[9px] text-slate-500 font-bold uppercase">OUTAGES & LINKS</span>
          </div>

          <div className="space-y-3">
            {presets.map((preset, index) => (
              <div 
                key={index}
                className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{preset.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{preset.description}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                  <div className="flex gap-2.5 text-[9px] text-slate-400 font-mono">
                    <span>{preset.latency}ms</span>
                    <span>•</span>
                    <span className="text-[#EF4444] font-bold">{preset.errorCode}</span>
                    <span>•</span>
                    <span>{preset.failureRate}% errs</span>
                  </div>
                  <button
                    onClick={() => handleApplyPreset(preset)}
                    className="btn-3d text-[10px] px-2.5 py-1"
                  >
                    Apply Preset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
