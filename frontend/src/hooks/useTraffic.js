import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export function useTraffic() {
  const { trafficLogs, clearTrafficLogs } = useStore();
  const isProxyActive = useStore(state => state.isProxyActive);
  const proxyId = useStore(state => state.proxyId);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch real-time traffic from the backend proxy
  useEffect(() => {
    if (!isProxyActive || !proxyId) return;

    const fetchTraffic = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/proxy/${proxyId}/traffic`);
        if (response.data && response.data.success) {
          // Format backend traffic logs to match frontend expectations
          const formattedLogs = response.data.traffic.map(log => ({
            id: log.id,
            method: log.method,
            route: log.route,
            status: log.status,
            time: new Date(log.timestamp).getTime(),
            responseTime: typeof log.responseTime === 'number' ? `${log.responseTime}ms` : log.responseTime,
            responseSize: typeof log.responseSize === 'number' ? `${log.responseSize}B` : log.responseSize,
            headers: log.headers || {},
            body: log.error ? { error: log.error } : log.responseBody || null,
          }));

          useStore.setState({
            trafficLogs: formattedLogs,
            trafficStats: response.data.stats || {
              total: formattedLogs.length,
              success: formattedLogs.filter(l => l.status < 400).length,
              errors: formattedLogs.filter(l => l.status >= 400).length,
              avgResponseTime: 0,
              requestsPerSecond: 0
            }
          });
        }
      } catch (err) {
        console.error('Failed to fetch traffic from backend proxy:', err);
      }
    };

    // Initial fetch
    fetchTraffic();

    // Poll every 1.5 seconds
    const interval = setInterval(fetchTraffic, 1500);

    return () => clearInterval(interval);
  }, [isProxyActive, proxyId]);

  const getFilteredLogs = () => {
    let logs = trafficLogs;

    if (filter !== 'all') {
      if (filter === 'success') {
        logs = logs.filter(log => log.status < 400);
      } else if (filter === 'error') {
        logs = logs.filter(log => log.status >= 400);
      } else {
        logs = logs.filter(log => log.method === filter.toUpperCase());
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      logs = logs.filter(log => 
        log.route.toLowerCase().includes(searchLower) ||
        log.method.toLowerCase().includes(searchLower) ||
        log.status.toString().includes(search)
      );
    }

    return logs;
  };

  const handleClearLogs = async () => {
    const activeProxyId = useStore.getState().proxyId;
    if (activeProxyId) {
      try {
        await axios.delete(`${API_BASE_URL}/api/proxy/${activeProxyId}/traffic`);
      } catch (err) {
        console.error('Failed to clear traffic on backend:', err);
      }
    }
    clearTrafficLogs();
  };

  const getStats = () => {
    const total = trafficLogs.length;
    const success = trafficLogs.filter(log => log.status < 400).length;
    const errors = trafficLogs.filter(log => log.status >= 400).length;
    const avgResponseTime = trafficLogs.length > 0
      ? trafficLogs.reduce((acc, log) => acc + parseInt(log.responseTime || 0), 0) / trafficLogs.length
      : 0;

    return {
      total,
      success,
      errors,
      avgResponseTime: Math.round(avgResponseTime),
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
    };
  };

  return {
    trafficLogs,
    filteredLogs: getFilteredLogs(),
    selectedLog,
    setSelectedLog,
    filter,
    setFilter,
    search,
    setSearch,
    clearTrafficLogs: handleClearLogs,
    stats: getStats(),
  };
}
