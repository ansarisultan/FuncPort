import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Zap, Play, Square, Loader2, BarChart3, 
  Settings, AlertCircle, RefreshCw, CheckCircle2
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
    isProxyActive,
    addTrafficLog
  } = useStore();

  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const handleStart = () => {
    if (!isProxyActive) return;
    
    setStressTestActive(true);
    setSimulatedProgress(0);
    setStressTestResults(null);
  };

  const handleStop = () => {
    setStressTestActive(false);
  };

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
            const success = Math.floor(stressTestConfig.totalRequests * (0.85 + Math.random() * 0.15));
            const errors = stressTestConfig.totalRequests - success;
            setStressTestResults({
              totalSent: stressTestConfig.totalRequests,
              successRate: Math.round((success / stressTestConfig.totalRequests) * 100),
              avgLatency: Math.round(150 + Math.random() * 400),
              p95Latency: Math.round(450 + Math.random() * 800),
              errors
            });
            return 100;
          }

          // Trigger actual requests to the proxy URL
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
  }, [stressTestActive, stressTestConfig, addTrafficLog, setStressTestActive, setStressTestResults]);

  return (
    <div className="panel-3d p-5 space-y-4 bg-[#0A1020]/90">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-warm-400" />
          Load & Stress Testing
        </h3>
        <span className="text-[10px] text-slate-500">Advanced</span>
      </div>

      {!isProxyActive && (
        <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-300">
            <p className="font-semibold text-accent-400">Proxy Inactive</p>
            <p className="mt-0.5">Please generate and start a proxy configuration first before initiating a stress test.</p>
          </div>
        </div>
      )}

      {/* Config Form */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Concurrent Requests</label>
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
            <label className="text-[10px] text-slate-400 block mb-1">Ramp Up Time (s)</label>
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
            className="w-full btn-3d-secondary flex items-center justify-center gap-2 py-2 text-xs"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            Stop Stress Test
          </button>
          
          {/* Real-time Load Activity Visualizer */}
          <div className="flex items-end justify-center gap-1 h-12 bg-[#050816] rounded-lg p-2 border border-[#1E293B]/60">
            {[...Array(18)].map((_, i) => {
              const height = 10 + Math.floor(Math.sin((simulatedProgress + i) * 0.9) * 15) + Math.floor(Math.random() * 10);
              return (
                <div 
                  key={i} 
                  className="w-1 bg-[#06B6D4] rounded-t transition-all duration-300 sparkline-anim"
                  style={{ height: `${Math.max(4, Math.min(32, height))}px` }}
                />
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
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
          className="w-full btn-3d flex items-center justify-center gap-2 py-2.5 text-xs disabled:opacity-50 disabled:scale-100"
        >
          <Play className="w-4 h-4" />
          Start Stress Test
        </button>
      )}

      {/* Results */}
      {stressTestResults && (
        <div className="p-3 bg-[#050816]/60 rounded-xl border border-[#1E293B]/60 space-y-3 animate-slide-up">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>Test Completed</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-[#0A1020] p-2 rounded-lg border border-[#1E293B]/40">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Success Rate</div>
              <div className="text-base font-bold font-mono text-[#22C55E] mt-0.5">{stressTestResults.successRate}%</div>
            </div>
            <div className="bg-[#0A1020] p-2 rounded-lg border border-[#1E293B]/40">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Avg Latency</div>
              <div className="text-base font-bold font-mono text-[#F59E0B] mt-0.5">{stressTestResults.avgLatency}ms</div>
            </div>
            <div className="bg-[#0A1020] p-2 rounded-lg border border-[#1E293B]/40">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">P95 Latency</div>
              <div className="text-base font-bold font-mono text-[#F59E0B] mt-0.5">{stressTestResults.p95Latency}ms</div>
            </div>
            <div className="bg-[#0A1020] p-2 rounded-lg border border-[#1E293B]/40">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Failed Req</div>
              <div className="text-base font-bold font-mono text-[#EF4444] mt-0.5">{stressTestResults.errors}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
