import { storageService } from './storageService.js';
import { v4 as uuidv4 } from 'uuid';

class ScenarioService {
  constructor() {
    this.scenarios = [];
    this.loadScenarios();
  }

  async loadScenarios() {
    try {
      const data = await storageService.read('scenarios');
      if (data && data.scenarios) {
        this.scenarios = data.scenarios;
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
    }
  }

  async saveScenarios() {
    try {
      const data = {
        scenarios: this.scenarios,
        updatedAt: new Date().toISOString(),
      };
      await storageService.write('scenarios', data);
    } catch (error) {
      console.error('Error saving scenarios:', error);
    }
  }

  async createScenario(scenarioData) {
    const scenario = {
      id: uuidv4(),
      name: scenarioData.name || 'Unnamed Scenario',
      description: scenarioData.description || '',
      networkConfig: {
        latency: scenarioData.latency || 0,
        errorCode: scenarioData.errorCode || 'none',
        failureRate: scenarioData.failureRate || 0,
        rateLimit: scenarioData.rateLimit || 'none',
        networkProfile: scenarioData.networkProfile || 'custom',
        payloadMultiplier: scenarioData.payloadMultiplier || 1,
      },
      schemaMutations: scenarioData.schemaMutations || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: scenarioData.isActive || false,
    };

    this.scenarios.push(scenario);
    await this.saveScenarios();
    return scenario;
  }

  async getScenarios() {
    return this.scenarios;
  }

  async getScenario(id) {
    return this.scenarios.find(s => s.id === id) || null;
  }

  async updateScenario(id, updates) {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.scenarios[index] = {
      ...this.scenarios[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveScenarios();
    return this.scenarios[index];
  }

  async deleteScenario(id) {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.scenarios.splice(index, 1);
    await this.saveScenarios();
    return true;
  }

  async applyScenario(id, proxyId) {
    const scenario = await this.getScenario(id);
    if (!scenario) return null;

    // Apply scenario to proxy
    const { proxyService } = await import('./proxyService.js');
    const proxy = await proxyService.updateProxy(proxyId, {
      networkConfig: scenario.networkConfig,
      schemaMutations: scenario.schemaMutations,
    });

    return proxy;
  }
}

export const scenarioService = new ScenarioService();
