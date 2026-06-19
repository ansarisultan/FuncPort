import { v4 as uuidv4 } from 'uuid';
import { storageService } from './storageService.js';
import crypto from 'crypto';
import axios from 'axios';

class ProxyService {
  constructor() {
    this.proxies = new Map();
    this.loadProxies();
  }

  async loadProxies() {
    try {
      const data = await storageService.read('proxies');
      if (data && data.proxies) {
        data.proxies.forEach(proxy => {
          this.proxies.set(proxy.id, proxy);
        });
      }
    } catch (error) {
      console.error('Error loading proxies:', error);
    }
  }

  async saveProxies() {
    try {
      const data = {
        proxies: Array.from(this.proxies.values()),
        updatedAt: new Date().toISOString(),
      };
      await storageService.write('proxies', data);
    } catch (error) {
      console.error('Error saving proxies:', error);
    }
  }

  async createProxy(config) {
    const proxyId = uuidv4().substring(0, 8);
    const proxy = {
      id: proxyId,
      backendUrl: config.backendUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      networkConfig: {
        latency: config.latency || 0,
        errorCode: config.errorCode || 'none',
        failureRate: config.failureRate || 0,
        rateLimit: config.rateLimit || 'none',
        networkProfile: config.networkProfile || 'custom',
        payloadMultiplier: config.payloadMultiplier || 1,
      },
      schemaMutations: config.schemaMutations || {},
      stats: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
      },
    };

    this.proxies.set(proxyId, proxy);
    await this.saveProxies();

    return proxy;
  }

  async getProxyConfig(proxyId) {
    return this.proxies.get(proxyId) || null;
  }

  async updateProxy(proxyId, updates) {
    const proxy = this.proxies.get(proxyId);
    if (!proxy) return null;

    Object.assign(proxy, updates);
    proxy.updatedAt = new Date().toISOString();

    await this.saveProxies();
    return proxy;
  }

  async deleteProxy(proxyId) {
    const deleted = this.proxies.delete(proxyId);
    if (deleted) {
      await this.saveProxies();
    }
    return deleted;
  }

  async updateStats(proxyId, stats) {
    const proxy = this.proxies.get(proxyId);
    if (!proxy) return null;

    proxy.stats.totalRequests += stats.totalRequests || 0;
    proxy.stats.successfulRequests += stats.successfulRequests || 0;
    proxy.stats.failedRequests += stats.failedRequests || 0;
    proxy.stats.averageResponseTime = 
      (proxy.stats.averageResponseTime + stats.responseTime) / 2;

    await this.saveProxies();
    return proxy.stats;
  }

  async generateProxyUrl(proxyId) {
    const baseUrl = process.env.PROXY_BASE_URL || 'http://mock.funclexa.com';
    return `${baseUrl}/p/${proxyId}`;
  }

  validateUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async checkNetwork(url) {
    try {
      const startTime = Date.now();
      const response = await axios({
        method: 'get',
        url: url,
        timeout: 5000,
        headers: {
          'User-Agent': 'FuncPort-Network-Checker/1.0',
        },
        validateStatus: () => true,
      });
      const responseTime = Date.now() - startTime;
      return {
        online: true,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        message: `Successfully connected to backend. Status: ${response.status} (${response.statusText || 'OK'})`,
      };
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'ENOTFOUND') {
        errorMessage = 'DNS lookup failed. Hostname not found.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused. Is the server running?';
      } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
        errorMessage = 'Connection timed out after 5 seconds.';
      }
      return {
        online: false,
        error: error.code || 'UNKNOWN',
        message: errorMessage,
      };
    }
  }

  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const proxyService = new ProxyService();
