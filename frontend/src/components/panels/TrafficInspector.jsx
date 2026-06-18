import { useState, useEffect } from 'react';
import { useTraffic } from '../../hooks/useTraffic';
import { 
  Activity, Filter, Search, Download, 
  X, ChevronDown, ChevronRight,
  Clock, ArrowUpRight, ArrowDownRight,
  Copy, Check, Eye, EyeOff,
  BarChart3, TrendingUp, TrendingDown
} from 'lucide-react';
import { format } from 'date-fns';

export default function TrafficInspector({ mini = false }) {
  const { 
    filteredLogs, 
    selectedLog, 
    setSelectedLog,
    filter,
    setFilter,
    search,
    setSearch,
    clearTrafficLogs,
    stats 
  } = useTraffic();

  const [copied, setCopied] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [showDetails, setShowDetails] = useState(false);

  const toggleLogExpand = (id) => {
    const newSet = new Set(expandedLogs);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedLogs(newSet);
  };

  const copyLog = (log) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getStatusColor = (status) => {
    if (status < 300) return 'text-success-400';
    if (status < 400) return 'text-warm-400';
    if (status < 500) return 'text-accent-400';
    return 'text-red-400';
  };

  const getStatusBg = (status) => {
    if (status < 300) return 'bg-success-500/10 border-success-500/20';
    if (status < 400) return 'bg-warm-500/10 border-warm-500/20';
    if (status < 500) return 'bg-accent-500/10 border-accent-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getMethodColor = (method) => {
    switch(method) {
      case 'GET': return 'text-primary-400';
      case 'POST': return 'text-secondary-400';
      case 'PUT': return 'text-warm-400';
      case 'DELETE': return 'text-accent-400';
      case 'PATCH': return 'text-success-400';
      default: return 'text-slate-400';
    }
  };

  if (mini) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Live Traffic
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="text-success-400">{stats.success}</span>
            <span>/</span>
            <span className="text-accent-400">{stats.errors}</span>
            <span className="text-slate-600">|</span>
            <span>{stats.avgResponseTime}ms</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {filteredLogs.slice(0, 10).map(log => (
            <div
              key={log.id}
              className={`flex items-center gap-2 p-1.5 rounded hover:bg-white/5 transition cursor-pointer text-[10px] group ${
                selectedLog?.id === log.id ? 'bg-white/5' : ''
              }`}
              onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
            >
              <span className={getMethodColor(log.method)}>{log.method}</span>
              <span className="text-slate-400 truncate flex-1">{log.route}</span>
              <span className={getStatusColor(log.status)}>{log.status}</span>
              <span className="text-slate-500">{log.responseTime}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center text-slate-500 text-xs py-8">
              No traffic yet
            </div>
          )}
        </div>
        {selectedLog && (
          <div className="border-t border-white/5 mt-2 pt-2 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{selectedLog.method}</span>
              <span className={`text-xs font-mono ${getStatusColor(selectedLog.status)}`}>
                {selectedLog.status}
              </span>
            </div>
            <div className="text-xs text-slate-300 truncate">{selectedLog.route}</div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>{selectedLog.responseTime}</span>
              <span>•</span>
              <span>{selectedLog.responseSize}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="panel-3d h-full flex flex-col overflow-hidden bg-[#0A1020]/90">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Traffic Inspector</h3>
          <span className="text-xs text-slate-500">{filteredLogs.length} requests</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#10182D]/85 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-primary-500 outline-none"
          >
            <option value="all">All</option>
            <option value="success">Success (2xx)</option>
            <option value="error">Error (4xx/5xx)</option>
            <option value="get">GET</option>
            <option value="post">POST</option>
            <option value="put">PUT</option>
            <option value="delete">DELETE</option>
            <option value="patch">PATCH</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#10182D]/85 border border-white/5 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-primary-500 outline-none w-32"
            />
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition text-slate-400 hover:text-white"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Export */}
          <button
            onClick={() => {
              const data = JSON.stringify(filteredLogs, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `traffic-logs-${Date.now()}.json`;
              a.click();
            }}
            className="p-1.5 rounded-lg hover:bg-white/5 transition text-slate-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={clearTrafficLogs}
            className="text-xs text-slate-500 hover:text-accent-400 transition px-2 py-1"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 border-b border-white/5 flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="text-slate-400">Total:</span>
          <span className="text-white font-mono">{stats.total}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-success-400">●</span>
          <span className="text-slate-400">Success:</span>
          <span className="text-success-400 font-mono">{stats.success}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-accent-400">●</span>
          <span className="text-slate-400">Errors:</span>
          <span className="text-accent-400 font-mono">{stats.errors}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-slate-400">Rate:</span>
          <span className="text-white font-mono">{stats.successRate}%</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-slate-400">Avg:</span>
          <span className="text-white font-mono">{stats.avgResponseTime}ms</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-slate-400">RPS:</span>
          <span className="text-white font-mono">{stats.requestsPerSecond || 0}</span>
        </span>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No traffic logged yet</p>
            <p className="text-xs text-slate-500">Make requests to your proxy to see them here</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className={`rounded-xl border transition-all duration-200 ${
                selectedLog?.id === log.id 
                  ? 'border-primary-500/30 bg-primary-500/5' 
                  : 'border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div
                className="flex items-center gap-3 p-2.5 cursor-pointer"
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLogExpand(log.id); }}
                  className="text-slate-500 hover:text-white transition"
                >
                  {expandedLogs.has(log.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <span className={`text-xs font-mono font-medium ${getMethodColor(log.method)} w-12`}>
                  {log.method}
                </span>
                <span className="text-xs text-slate-300 font-mono flex-1 truncate">{log.route}</span>
                <span className={`text-xs font-mono ${getStatusColor(log.status)} w-12 text-right`}>
                  {log.status}
                </span>
                <span className="text-[10px] text-slate-500 w-16 text-right">
                  {log.responseTime}
                </span>
                <span className="text-[10px] text-slate-500 w-16 text-right hidden sm:block">
                  {log.responseSize}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyLog(log); }}
                    className="p-1 rounded hover:bg-white/5 transition text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedLogs.has(log.id) && (
                <div className="px-4 pb-3 pt-2 border-t border-white/5 space-y-2 animate-slide-up">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-500">Time:</span>
                      <span className="text-slate-300 ml-2 font-mono">
                        {format(log.time, 'HH:mm:ss.SSS')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Size:</span>
                      <span className="text-slate-300 ml-2 font-mono">{log.responseSize}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span>
                      <span className={`ml-2 font-mono ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Method:</span>
                      <span className={`ml-2 font-mono ${getMethodColor(log.method)}`}>
                        {log.method}
                      </span>
                    </div>
                  </div>
                  
                  {showDetails && (
                    <>
                      {log.headers && (
                        <div>
                          <span className="text-[10px] text-slate-500">Headers</span>
                          <pre className="text-[10px] font-mono text-slate-300 bg-black/30 p-2 rounded-lg overflow-auto max-h-32">
                            {JSON.stringify(log.headers, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.body && (
                        <div>
                          <span className="text-[10px] text-slate-500">Body</span>
                          <pre className="text-[10px] font-mono text-slate-300 bg-black/30 p-2 rounded-lg overflow-auto max-h-32">
                            {JSON.stringify(log.body, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
