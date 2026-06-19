import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Clock, Zap, AlertCircle, Activity, 
  Wifi, WifiOff, BarChart3, Sliders,
  ChevronDown, ChevronUp, Server,
  Signal, SignalLow, SignalMedium, SignalHigh,
  Database, RefreshCw
} from 'lucide-react';

const errorCodes = [
  { value: 'none', label: 'No Error', color: 'success' },
  { value: '400', label: '400 Bad Request', color: 'error' },
  { value: '401', label: '401 Unauthorized', color: 'error' },
  { value: '403', label: '403 Forbidden', color: 'error' },
  { value: '404', label: '404 Not Found', color: 'error' },
  { value: '429', label: '429 Too Many Requests', color: 'warning' },
  { value: '500', label: '500 Internal Server Error', color: 'error' },
  { value: '503', label: '503 Service Unavailable', color: 'error' },
];

const networkProfiles = [
  { value: 'custom', label: 'Custom', icon: Server },
  { value: 'fast-wifi', label: 'Fast WiFi (0ms, 0%)', icon: SignalHigh },
  { value: '4g', label: '4G (100ms, 5%)', icon: SignalHigh },
  { value: '3g', label: '3G (300ms, 10%)', icon: SignalMedium },
  { value: '2g', label: '2G (800ms, 20%)', icon: SignalLow },
  { value: 'satellite', label: 'Satellite (1500ms, 25%)', icon: SignalLow },
];

export default function NetworkControls() {
  const {
    latency,
    errorCode,
    failureRate,
    rateLimit,
    networkProfile,
    payloadMultiplier,
    setLatency,
    setErrorCode,
    setFailureRate,
    setRateLimit,
    setNetworkProfile,
    setPayloadMultiplier,
  } = useStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const latencyOptions = [0, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 30000];
  const rateLimits = [
    { value: 'none', label: 'No Limit' },
    { value: '5', label: '5 requests/min' },
    { value: '20', label: '20 requests/min' },
    { value: '100', label: '100 requests/min' },
    { value: '500', label: '500 requests/min' },
    { value: '1000', label: '1000 requests/min' },
  ];

  const multiplierOptions = [1, 10, 100, 500, 1000, 5000, 10000];

  const getProfileIcon = (profile) => {
    const found = networkProfiles.find(p => p.value === profile);
    if (found && found.icon) {
      const Icon = found.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Server className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Network Profile */}
      <div className="panel-3d p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Wifi className="w-4 h-4 text-secondary-400" />
            Network Profile
          </h3>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            {getProfileIcon(networkProfile)}
            {networkProfiles.find(p => p.value === networkProfile)?.label.split(' ')[0] || 'Custom'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {networkProfiles.map(profile => {
            const Icon = profile.icon || Server;
            const isActive = networkProfile === profile.value;
            return (
              <button
                key={profile.value}
                onClick={() => setNetworkProfile(profile.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-secondary-400' : 'text-slate-500'}`} />
                <span className="truncate">{profile.label.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Latency */}
      <div className="panel-3d p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-400" />
            <h3 className="text-sm font-semibold text-white">Latency</h3>
          </div>
          <span className="text-sm font-mono text-white">{latency}ms</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {latencyOptions.map(ms => (
            <button
              key={ms}
              onClick={() => setLatency(ms)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                latency === ms
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {ms === 0 ? '0ms' : ms >= 1000 ? `${ms/1000}s` : `${ms}ms`}
            </button>
          ))}
        </div>
      </div>

      {/* Error Injection */}
      <div className="panel-3d p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-white">Error Injection</h3>
          </div>
          <span className="text-sm font-mono text-white">{errorCode === 'none' ? 'None' : errorCode}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {errorCodes.map(code => (
            <button
              key={code.value}
              onClick={() => setErrorCode(code.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                errorCode === code.value
                  ? code.value === 'none'
                    ? 'bg-success-500/20 text-success-400 border border-success-500/20'
                    : `bg-accent-500/20 text-accent-400 border border-accent-500/20`
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {code.label}
            </button>
          ))}
        </div>
      </div>

      {/* Failure Rate */}
      <div className="panel-3d p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-warm-400" />
            <h3 className="text-sm font-semibold text-white">Failure Rate</h3>
          </div>
          <span className="text-sm font-mono text-white">{failureRate}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={failureRate}
          onChange={(e) => setFailureRate(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer
            accent-primary-500
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
            [&::-webkit-slider-thumb]:from-primary-500 [&::-webkit-slider-thumb]:to-secondary-400
            [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0%</span>
          <span className="text-warm-400">Recommended: 10-25%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Rate Limit */}
      <div className="panel-3d p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-secondary-400" />
            <h3 className="text-sm font-semibold text-white">Rate Limit</h3>
          </div>
          <span className="text-sm font-mono text-white">
            {rateLimit === 'none' ? 'No Limit' : `${rateLimit}/min`}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rateLimits.map(limit => (
            <button
              key={limit.value}
              onClick={() => setRateLimit(limit.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                rateLimit === limit.value
                  ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {limit.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Controls Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition text-xs text-slate-400 hover:text-white"
      >
        <span className="flex items-center gap-2">
          <Sliders className="w-3 h-3" />
          Advanced Controls
        </span>
        {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {showAdvanced && (
        <div className="panel-3d p-6 space-y-4 animate-slide-up">
          {/* Payload Multiplier */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Database className="w-3 h-3 text-warm-400" />
              <span>Payload Multiplier</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {multiplierOptions.map(mult => (
                <button
                  key={mult}
                  onClick={() => setPayloadMultiplier(mult)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    payloadMultiplier === mult
                      ? 'bg-warm-500/20 text-warm-400 border border-warm-500/20'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              Transform payload sizes to test frontend performance
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setLatency(0);
              setErrorCode('none');
              setFailureRate(0);
              setRateLimit('none');
              setNetworkProfile('custom');
              setPayloadMultiplier(1);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-xs text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-3 h-3" />
            Reset All Network Settings
          </button>
        </div>
      )}
    </div>
  );
}
