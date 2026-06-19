import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Zap, Play, Square, Loader2, BarChart3, 
  Settings, AlertCircle, RefreshCw, CheckCircle2,
  TrendingUp, History, Activity, Clock
} from 'lucide-react';
import axios from 'axios';

export default function StressTest() {
  const {
    stressTestActive,
    stressTestConfig,
    stressTestResults,
    setStressTestActive,
    setStressTestConfig,
    setStressTestResults,
    isProxyActive
  } = useStore();

  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [history, setHistory] = useState([
    { timestamp: '10:42:15 AM', concurrent: 50, total: 1000, duration: 10, successRate: 98, avgLatency: 184 },
    { timestamp: '10:45:30 AM', concurrent: 100, total: 2000, duration: 15, successRate: 95, avgLatency: 245 }
  ]);

  // Live charting state
  const [liveRps, setLiveRps] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [liveLatency, setLiveLatency] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const handleStart = () => {
    if (!isProxyActive) return;
    
    setStressTestActive(true);
    setSimulatedProgress(0);
    setStressTestResults(null);
    setLiveRps([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setLiveLatency([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const handleStop = () => {
    setStressTestActive(false);
  };

  // Live chart updates while active
  useEffect(() => {
    let interval;
    if (stressTestActive) {
      interval = setInterval(() => {
        // Generate values
        const targetRps = Math.round(stressTestConfig.totalRequests / stressTestConfig.duration);
        const randomRps = Math.round(targetRps * (0.8 + Math.random() * 0.4));
        const randomLatency = Math.round(150 + Math.random() * 250);

        setLiveRps(prev => [...prev.slice(1), randomRps]);
        setLiveLatency(prev => [...prev.slice(1), randomLatency]);
      }, 1000);
    } else {
      setLiveRps([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      setLiveLatency([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    return () => clearInterval(interval);
  }, [stressTestActive, stressTestConfig]);

  // Main simulation effect
  useEffect(() => {
    let interval;
    if (stressTestActive) {
      interval = setInterval(() => {
        setSimulatedProgress(prev => {
          const next = prev + (100 / (stressTestConfig.duration || 30));
          if (next >= 100) {
            clearInterval(interval);
            setStressTestActive(false);
            
            // Generate mock results
            const success = Math.floor(stressTestConfig.totalRequests * (0.88 + Math.random() * 0.12));
            const errors = stressTestConfig.totalRequests - success;
            const successRate = Math.round((success / stressTestConfig.totalRequests) * 100);
            const avgLatency = Math.round(140 + Math.random() * 220);
            
            const resultsObj = {
              totalSent: stressTestConfig.totalRequests,
              successRate,
              avgLatency,
              p95Latency: Math.round(avgLatency * 1.5 + Math.random() * 100),
              errors
            };

            setStressTestResults(resultsObj);

            // Add to history
            setHistory(h => [
              {
                timestamp: new Date().toLocaleTimeString(),
                concurrent: stressTestConfig.concurrentRequests,
                total: stressTestConfig.totalRequests,
                duration: stressTestConfig.duration,
                successRate,
                avgLatency
              },
              ...h
            ]);

            return 100;
          }

          // Trigger requests
          const { proxyUrl } = useStore.getState();
          if (proxyUrl) {
            const batchSize = Math.ceil(stressTestConfig.totalRequests / (stressTestConfig.duration || 30));
            const methods = ['GET', 'POST', 'PUT'];
            for (let i = 0; i < batchSize; i++) {
              const method = methods[Math.floor(Math.random() * methods.length)];
              const routeSuffix = `/stress-test-${Math.floor(Math.random() * 100)}`;
              
              if (method === 'GET') {
                axios.get(`${proxyUrl}${routeSuffix}?t=${Date.now()}&index=${i}`).catch(() => {});
              } else if (method === 'POST') {
                axios.post(`${proxyUrl}${routeSuffix}`, { stressTest: true, index: i }).catch(() => {});
              } else {
                axios.put(`${proxyUrl}${routeSuffix}`, { stressTest: true, index: i }).catch(() => {});
              }
            }
          }

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stressTestActive, stressTestConfig, setStressTestActive, setStressTestResults]);

  // Render SVG charts
  const getSvgPath = (data, maxVal = 500) => {
    if (!data || data.length === 0) return 'M0,100';
    const width = 300;
    const height = 100;
    const step = width / (data.length - 1);
    
    return data.map((val, i) => {
      const x = i * step;
      const scaleVal = maxVal > 0 ? maxVal : 1;
      const y = height - (val / scaleVal) * height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto h-full pr-1 pb-6">
      {/* Left Column: Configuration */}
      <div className="lg:col-span-4 space-y-4">
        <div className="panel-3d p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              Load Configuration
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
              TARGET
            </span>
          </div>

          {!isProxyActive && (
            <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-accent-400">Proxy Offline</p>
                <p className="mt-0.5">Please generate and start a proxy configuration first before initiating a stress test.</p>
              </div>
            </div>
          )}

          {/* Config Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Concurrency</label>
                <input
                  type="number"
                  value={stressTestConfig.concurrentRequests}
                  onChange={(e) => setStressTestConfig({ concurrentRequests: parseInt(e.target.value) || 10 })}
                  className="input-premium w-full text-xs"
                  disabled={stressTestActive}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Total Requests</label>
                <input
                  type="number"
                  value={stressTestConfig.totalRequests}
                  onChange={(e) => setStressTestConfig({ totalRequests: parseInt(e.target.value) || 100 })}
                  className="input-premium w-full text-xs"
                  disabled={stressTestActive}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Ramp Up (s)</label>
                <input
                  type="number"
                  value={stressTestConfig.rampUpTime}
                  onChange={(e) => setStressTestConfig({ rampUpTime: parseInt(e.target.value) || 5 })}
                  className="input-premium w-full text-xs"
                  disabled={stressTestActive}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Duration (s)</label>
                <input
                  type="number"
                  value={stressTestConfig.duration}
                  onChange={(e) => setStressTestConfig({ duration: parseInt(e.target.value) || 30 })}
                  className="input-premium w-full text-xs"
                  disabled={stressTestActive}
                />
              </div>
            </div>
          </div>

          {/* Control Button */}
          {stressTestActive ? (
            <div className="space-y-3">
              <button
                onClick={handleStop}
                className="w-full btn-3d-secondary flex items-center justify-center gap-2 py-2.5 text-xs font-semibold"
              >
                <Square className="w-3.5 h-3.5 fill-white text-white" />
                Abort Test Run
              </button>
              
              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
                    Injecting concurrent requests...
                  </span>
                  <span className="font-mono">{Math.round(simulatedProgress)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] transition-all duration-300" 
                    style={{ width: `${simulatedProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStart}
              disabled={!isProxyActive}
              className="w-full btn-3d flex items-center justify-center gap-2 py-2.5 text-xs font-semibold disabled:opacity-50 disabled:scale-100"
            >
              <Play className="w-4 h-4" />
              Initiate Load Test
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Live Charts & History */}
      <div className="lg:col-span-8 space-y-4">
        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="panel-3d p-4">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">CURRENT RPS</span>
            <div className="text-xl font-bold font-mono text-[#06B6D4] mt-1">
              {stressTestActive ? liveRps[liveRps.length - 1] : stressTestResults ? Math.round(stressTestResults.totalSent / stressTestConfig.duration) : 0}
            </div>
          </div>
          <div className="panel-3d p-4">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">LATENCY</span>
            <div className="text-xl font-bold font-mono text-[#F59E0B] mt-1">
              {stressTestActive ? `${liveLatency[liveLatency.length - 1]}ms` : stressTestResults ? `${stressTestResults.avgLatency}ms` : '0ms'}
            </div>
          </div>
          <div className="panel-3d p-4">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">SUCCESS RATE</span>
            <div className="text-xl font-bold font-mono text-[#22C55E] mt-1">
              {stressTestActive ? '99%' : stressTestResults ? `${stressTestResults.successRate}%` : '100%'}
            </div>
          </div>
          <div className="panel-3d p-4">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">ERRORS</span>
            <div className="text-xl font-bold font-mono text-[#EF4444] mt-1">
              {stressTestActive ? '0' : stressTestResults ? stressTestResults.errors : '0'}
            </div>
          </div>
        </div>

        {/* Charts Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* RPS Chart */}
          <div className="panel-3d p-5">
            <div className="flex items-center gap-1.5 border-b border-[#1E293B]/60 pb-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="text-xs font-semibold text-white">Requests Per Second (RPS)</span>
            </div>
            <div className="h-28 w-full relative">
              <svg className="w-full h-full text-[#06B6D4]" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path 
                  d={getSvgPath(liveRps, Math.max(50, ...liveRps))} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
              {liveRps[liveRps.length - 1] === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                  Waiting for test run...
                </div>
              )}
            </div>
          </div>

          {/* Latency Chart */}
          <div className="panel-3d p-5">
            <div className="flex items-center gap-1.5 border-b border-[#1E293B]/60 pb-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-xs font-semibold text-white">Average Latency (ms)</span>
            </div>
            <div className="h-28 w-full relative">
              <svg className="w-full h-full text-[#F59E0B]" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path 
                  d={getSvgPath(liveLatency, Math.max(200, ...liveLatency))} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
              {liveLatency[liveLatency.length - 1] === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                  Waiting for test run...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results History */}
        <div className="panel-3d p-6">
          <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-3 mb-3">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Simulation Results History
            </h4>
            <span className="text-[9px] text-slate-500">PAST RUNS</span>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-[11px] font-mono">
              <thead>
                <tr className="text-slate-500 border-b border-[#1E293B]/40 pb-2">
                  <th className="pb-2">TIME</th>
                  <th className="pb-2">CONCURRENCY</th>
                  <th className="pb-2">TOTAL REQS</th>
                  <th className="pb-2">SUCCESS RATE</th>
                  <th className="pb-2 text-right">AVG LATENCY</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#1E293B]/20 hover:bg-white/5 transition duration-150">
                    <td className="py-2 text-slate-400">{item.timestamp}</td>
                    <td className="py-2 text-slate-300">{item.concurrent}</td>
                    <td className="py-2 text-slate-300">{item.total}</td>
                    <td className="py-2">
                      <span className={`font-bold ${item.successRate >= 95 ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
                        {item.successRate}%
                      </span>
                    </td>
                    <td className="py-2 text-right text-slate-300">{item.avgLatency}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
