import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  FolderOpen, Plus, Save, Trash2, 
  Play, Clock, Settings, Copy,
  Check, X, Edit
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

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

  // Fetch scenarios on mount
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
        console.error('Failed to load scenarios from backend:', err);
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
      }
    } catch (err) {
      console.error('Failed to save scenario to backend:', err);
    }
  };

  const handleLoadScenario = async (id) => {
    loadScenario(id);
    
    // If a proxy is active, also apply the scenario to the backend proxy
    const activeProxyId = useStore.getState().proxyId;
    if (activeProxyId) {
      try {
        await axios.post(`${API_BASE_URL}/api/scenarios/${id}/apply/${activeProxyId}`);
      } catch (err) {
        console.error('Failed to apply scenario to backend proxy:', err);
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
          // Reset to custom
          loadScenario(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete scenario from backend:', err);
    }
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
    <div className="panel-3d p-5 space-y-4 bg-[#0A1020]/90">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary-400" />
          Scenarios
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-3d flex items-center gap-1.5 text-xs px-3 py-1.5 animate-pulse-glow"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Current
        </button>
      </div>

      {/* Create Scenario */}
      {isCreating && (
        <div className="space-y-3 animate-slide-up">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="Scenario name..."
            className="input-premium w-full"
            autoFocus
          />
          <div className="flex items-center gap-2">
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
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">No scenarios saved</p>
          <p className="text-xs text-slate-500 mt-1">Configure your network conditions and save them as scenarios</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                activeScenario === scenario.id
                  ? 'bg-primary-500/10 border-primary-500/20'
                  : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {scenario.name}
                    </span>
                    {activeScenario === scenario.id && (
                      <span className="text-[8px] font-medium text-success-400 bg-success-500/20 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {scenario.latency}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      {scenario.errorCode === 'none' ? 'No Error' : scenario.errorCode}
                    </span>
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      {scenario.failureRate}% failure
                    </span>
                    <span>
                      {getProfileLabel(scenario.networkProfile)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleLoadScenario(scenario.id)}
                    className="p-1.5 rounded hover:bg-white/5 transition text-slate-400 hover:text-success-400"
                    title="Load Scenario"
                  >
                    <Play className="w-3.5 h-3.5" />
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

      {/* Quick Tips */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="text-primary-400">💡</span>
          <span>Scenarios save all network conditions for quick reuse</span>
        </div>
      </div>
    </div>
  );
}
