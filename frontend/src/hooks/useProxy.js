import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

export function useProxy() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const { 
    backendUrl, 
    proxyId,
    setProxyId,
    setProxyUrl, 
    setIsProxyActive,
    latency,
    errorCode,
    failureRate,
    rateLimit,
    payloadMultiplier,
    schemaMutations,
    networkProfile,
    addTrafficLog
  } = useStore();

  const getNetworkConfig = () => {
    return {
      latency: useStore.getState().latency,
      errorCode: useStore.getState().errorCode,
      failureRate: useStore.getState().failureRate,
      rateLimit: useStore.getState().rateLimit || 'none',
      payloadMultiplier: useStore.getState().payloadMultiplier || 1,
      networkProfile: useStore.getState().networkProfile || 'custom',
    };
  };

  const generateProxy = async () => {
    if (!backendUrl) {
      setError('Please enter a backend URL');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const networkConfig = getNetworkConfig();
      const currentSchemaMutations = useStore.getState().schemaMutations;

      const response = await axios.post(`${API_BASE_URL}/api/proxy/create`, {
        backendUrl,
        networkConfig,
        schemaMutations: currentSchemaMutations
      });

      if (response.data && response.data.success) {
        const { id, proxyUrl } = response.data.proxy;
        setProxyId(id);
        setProxyUrl(proxyUrl);
        setIsProxyActive(true);
        
        // Add initial log
        addTrafficLog({
          id: Date.now(),
          method: 'PROXY',
          route: 'generated',
          status: 201,
          time: Date.now(),
          responseTime: '0ms',
          responseSize: '0B',
          details: `Proxy created for ${backendUrl}. Proxy ID: ${id}`
        });

        return proxyUrl;
      } else {
        throw new Error(response.data?.message || 'Failed to generate proxy');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate proxy');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const stopProxy = async () => {
    const currentProxyId = useStore.getState().proxyId;
    if (currentProxyId) {
      try {
        await axios.put(`${API_BASE_URL}/api/proxy/${currentProxyId}`, { isActive: false });
      } catch (err) {
        console.error('Failed to deactivate proxy on backend:', err);
      }
    }
    setIsProxyActive(false);
    setProxyUrl('');
    setProxyId(null);
  };

  const copyProxyUrl = async () => {
    const { proxyUrl } = useStore.getState();
    if (proxyUrl) {
      try {
        await navigator.clipboard.writeText(proxyUrl);
        return true;
      } catch (err) {
        setError('Failed to copy URL');
        return false;
      }
    }
    return false;
  };

  // Check active proxy status on mount (to verify if stored session exists on backend)
  useEffect(() => {
    const checkProxyStatus = async () => {
      const activeProxyId = useStore.getState().proxyId;
      const isProxyActive = useStore.getState().isProxyActive;
      if (isProxyActive && activeProxyId) {
        try {
          await axios.get(`${API_BASE_URL}/api/proxy/${activeProxyId}`);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setIsProxyActive(false);
            setProxyId(null);
            setProxyUrl('');
            toast.error('Active proxy was not found on the server. Deactivating.');
          }
        }
      }
    };
    checkProxyStatus();
  }, [setIsProxyActive, setProxyId, setProxyUrl]);

  // Sync network conditions and schema mutations to backend dynamically when settings change
  useEffect(() => {
    const activeProxyId = useStore.getState().proxyId;
    const isProxyActive = useStore.getState().isProxyActive;

    if (!isProxyActive || !activeProxyId) return;

    const syncConfig = async () => {
      try {
        const networkConfig = getNetworkConfig();
        const currentSchemaMutations = useStore.getState().schemaMutations;

        await axios.put(`${API_BASE_URL}/api/proxy/${activeProxyId}`, {
          networkConfig,
          schemaMutations: currentSchemaMutations
        });
      } catch (err) {
        console.error('Failed to sync settings with backend proxy:', err);
        if (err.response && err.response.status === 404) {
          setIsProxyActive(false);
          setProxyId(null);
          setProxyUrl('');
          toast.error('Saved proxy session has expired or was not found on the server.');
        }
      }
    };

    // Debounce backend sync slightly to avoid hitting API on every keystroke/slider drag
    const timer = setTimeout(syncConfig, 400);
    return () => clearTimeout(timer);
  }, [latency, errorCode, failureRate, rateLimit, payloadMultiplier, networkProfile, schemaMutations, setIsProxyActive, setProxyId, setProxyUrl]);

  return {
    generateProxy,
    stopProxy,
    copyProxyUrl,
    isGenerating,
    error,
    getNetworkConfig,
  };
}
