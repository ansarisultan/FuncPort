import express from 'express';
import { proxyService } from '../services/proxyService.js';
import { trafficService } from '../services/trafficService.js';
import { scenarioService } from '../services/scenarioService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'mock.funclexa Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.get('/status', async (req, res) => {
  try {
    const proxies = Array.from(proxyService.proxies?.values() || []);
    const scenarios = await scenarioService.getScenarios();
    const trafficStats = await trafficService.getTrafficStats();

    res.json({
      status: 'healthy',
      stats: {
        activeProxies: proxies.filter(p => p.isActive).length,
        totalProxies: proxies.length,
        totalScenarios: scenarios.length,
        totalTraffic: trafficStats.total || 0,
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

export default router;
