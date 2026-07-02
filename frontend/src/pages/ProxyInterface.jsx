import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  Shield, Globe, Loader2, AlertCircle, 
  Terminal, RefreshCw, Send, ArrowLeft, Activity, 
  Clock, Database, Lock
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProxyInterface() {
  const { proxyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proxyConfig, setProxyConfig] = useState(null);
  const [trafficLogs, setTrafficLogs] = useState([]);
  
  // Test Request state
  const [testMethod, setTestMethod] = useState('GET');
  const [testPath, setTestPath] = useState('');
  const [testPayload, setTestPayload] = useState('{\n  "test": true\n}');
  const [testResponse, setTestResponse] = useState(null);
  const [testing, setTesting] = useState(false);

  const fetchProxyData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Check if the proxy server/config is active and reachable via HTTPS
      const response = await axios.get(`${API_BASE_URL}/api/proxy/${proxyId}`);
      if (response.data && response.data.success) {
        setProxyConfig(response.data.proxy);
        
        // 2. Fetch recent traffic logs for this proxy
        const trafficResponse = await axios.get(`${API_BASE_URL}/api/proxy/${proxyId}/traffic?limit=10`);
        if (trafficResponse.data && trafficResponse.data.success) {
          setTrafficLogs(trafficResponse.data.traffic || []);
        }
      } else {
        throw new Error('Proxy configuration not found on the server.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Could not establish a connection to the proxy server. The server may be offline or the proxy ID is invalid.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (proxyId) {
      fetchProxyData();
    }
  }, [proxyId]);

  const handleTestRequest = async () => {
    setTesting(true);
    setTestResponse(null);
    try {
      // Clean path
      const formattedPath = testPath.startsWith('/') ? testPath : `/${testPath}`;
      
      // Construct the secure proxy request URL using API_BASE_URL (avoiding mixed content issues)
      const proxyTestUrl = `${API_BASE_URL}/p/${proxyId}${formattedPath}`;

      let parsedPayload = null;
      if (['POST', 'PUT', 'PATCH'].includes(testMethod)) {
        try {
          parsedPayload = JSON.parse(testPayload);
        } catch (e) {
          toast.error('Invalid JSON payload');
          setTesting(false);
          return;
        }
      }

      const startTime = Date.now();
      const response = await axios({
        method: testMethod,
        url: proxyTestUrl,
        data: parsedPayload,
        timeout: 10000,
        validateStatus: () => true, // capture all status codes
      });
      const duration = Date.now() - startTime;

      setTestResponse({
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        headers: response.headers,
        data: response.data
      });
      
      toast.success(`Request completed: Status ${response.status}`);
      // Refresh traffic logs
      const trafficResponse = await axios.get(`${API_BASE_URL}/api/proxy/${proxyId}/traffic?limit=10`);
      if (trafficResponse.data && trafficResponse.data.success) {
        setTrafficLogs(trafficResponse.data.traffic || []);
      }
    } catch (err) {
      setTestResponse({
        error: true,
        message: err.message,
        details: err.response?.data || 'Unreachable'
      });
      toast.error('Proxy request failed');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <div className="z-10 text-center space-y-6 animate-pulse">
          <Loader2 className="w-12 h-12 text-[#06B6D4] animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gradient-animated-funclexa font-sans">Connecting to Proxy Server...</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Establishing a secure HTTPS connection and validating the proxy environment session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <div className="z-10 max-w-md w-full panel-3d p-6 bg-[#0A1020]/90 backdrop-blur-2xl border-red-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertCircle className="w-8 h-8 animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-red-400 font-sans">Proxy Connection Failed</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {error}
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left text-[11px] text-slate-400 space-y-2 leading-relaxed">
            <p className="font-semibold text-white flex items-center gap-1.5 font-sans">
              <Lock className="w-3.5 h-3.5 text-primary-400" />
              Troubleshooting checklist:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Confirm the local or deployed proxy server is running.</li>
              <li>Verify the proxy session ID (<span className="text-primary-400 font-mono">{proxyId}</span>) has not expired.</li>
              <li>Ensure the backend endpoint supports HTTPS to bypass browser mixed-content restrictions.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/app')}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition font-sans"
            >
              Back to Dashboard
            </button>
            <button
              onClick={fetchProxyData}
              className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-semibold transition flex items-center justify-center gap-1.5 font-sans"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40 z-0" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0A1020]/90 backdrop-blur-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">Secure Proxy Interface</h1>
                <span className="text-[10px] font-semibold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Secure HTTPS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Proxy ID: {proxyId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => window.close()}
              className="flex-1 sm:flex-none py-2 px-3 text-xs font-semibold bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Close Tab
            </button>
            <button
              onClick={fetchProxyData}
              className="flex-1 sm:flex-none py-2 px-3 text-xs font-semibold bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-xl border border-primary-500/20 transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Status
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Info & Test Client */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Card */}
            <div className="panel-3d p-6 bg-[#0A1020]/90 backdrop-blur-2xl border border-white/10 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E293B]/60 pb-3">
                <Globe className="w-4 h-4 text-primary-400" />
                Proxy Session Routing Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">PROXY SECURE GATEWAY</span>
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-success-400 select-all truncate" title={proxyConfig?.proxyUrl}>
                    {proxyConfig?.proxyUrl || 'N/A'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">TARGET BACKEND DESTINATION</span>
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-primary-400 select-all truncate" title={proxyConfig?.backendUrl}>
                    {proxyConfig?.backendUrl || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Security info */}
              <div className="p-3 bg-success-500/10 border border-success-500/20 rounded-xl flex items-start gap-2.5 text-xs text-success-400">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Secure HTTP Forwarding Active</span>
                  This proxy routes requests from your client browser securely via HTTPS to the proxy server, which then interacts with your target backend server. This completely solves mixed-content blockages in browser apps.
                </div>
              </div>
            </div>

            {/* Test Request Panel */}
            <div className="panel-3d p-6 bg-[#0A1020]/90 backdrop-blur-2xl border border-white/10 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E293B]/60 pb-3">
                <Send className="w-4 h-4 text-[#F59E0B]" />
                Interactive Proxy Request Tester
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value)}
                    className="bg-[#10182D] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-primary-500/50"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">/p/{proxyId}</span>
                    <input
                      type="text"
                      placeholder="/users or /api/data"
                      value={testPath}
                      onChange={(e) => setTestPath(e.target.value)}
                      className="input-premium w-full pl-[95px] text-xs font-mono py-2"
                    />
                  </div>
                  
                  <button
                    onClick={handleTestRequest}
                    disabled={testing}
                    className="btn-3d px-4 py-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
                  >
                    {testing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send
                  </button>
                </div>

                {['POST', 'PUT', 'PATCH'].includes(testMethod) && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block font-mono">REQUEST JSON PAYLOAD</label>
                    <textarea
                      rows={4}
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      className="w-full bg-[#10182D] border border-white/10 rounded-xl p-3 text-xs font-mono text-[#06B6D4] placeholder-slate-600 outline-none focus:border-primary-500/50 resize-y"
                    />
                  </div>
                )}

                {testResponse && (
                  <div className="space-y-2 border-t border-[#1E293B]/60 pt-4 animate-slide-up">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">PROXY RESPONSE</span>
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-[#22C55E]" />
                          Status: <strong className={testResponse.error ? 'text-red-400' : 'text-[#22C55E]'}>{testResponse.status || 'Error'}</strong>
                        </span>
                        {testResponse.duration && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            Duration: {testResponse.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[#10182D] border border-white/10 rounded-xl overflow-x-auto max-h-[250px] overflow-y-auto no-scrollbar font-mono text-[11px]">
                      <pre className="text-slate-200">
                        {typeof testResponse.data === 'object'
                          ? JSON.stringify(testResponse.data, null, 2)
                          : String(testResponse.data || testResponse.message || '')}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right panel: Stats & Traffic Logs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Metrics */}
            <div className="panel-3d p-6 bg-[#0A1020]/90 backdrop-blur-2xl border-white/10 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E293B]/60 pb-3">
                <Database className="w-4 h-4 text-success-400" />
                Live Performance Stats
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Total Proxy Calls</span>
                  <span className="text-2xl font-bold font-mono text-[#06B6D4]">{proxyConfig?.stats?.totalRequests || 0}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Avg Response</span>
                  <span className="text-2xl font-bold font-mono text-[#F59E0B]">{Math.round(proxyConfig?.stats?.averageResponseTime || 0)}ms</span>
                </div>
                <div className="p-3 bg-[#22C55E]/5 rounded-xl border border-[#22C55E]/10 text-center col-span-2">
                  <span className="text-[10px] text-success-400/70 block uppercase font-bold tracking-wider mb-1">Session Active Uptime</span>
                  <span className="text-xs font-semibold text-[#22C55E] font-mono">
                    {proxyConfig?.createdAt ? new Date(proxyConfig.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Traffic Logs */}
            <div className="panel-3d p-6 bg-[#0A1020]/90 backdrop-blur-2xl border-white/10 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E293B]/60 pb-3">
                <Terminal className="w-4 h-4 text-primary-400" />
                Recent Proxy Requests
              </h2>
              
              {trafficLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 font-mono">
                  No requests captured for this proxy yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {trafficLogs.map((log, idx) => (
                    <div key={log.id || idx} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono transition">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'GET' ? 'bg-[#06B6D4]/10 text-[#06B6D4]' :
                          log.method === 'POST' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                          'bg-[#F59E0B]/10 text-[#F59E0B]'
                        }`}>
                          {log.method}
                        </span>
                        <span className="text-slate-300 truncate max-w-[120px] font-semibold" title={log.route}>
                          {log.route}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${log.status >= 400 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                          {log.status}
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          {log.responseTime ? `${log.responseTime}ms` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
