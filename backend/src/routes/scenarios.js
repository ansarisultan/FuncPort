import express from 'express';
import { scenarioService } from '../services/scenarioService.js';
import { proxyService } from '../services/proxyService.js';

const router = express.Router();

// Create scenario
router.post('/', async (req, res) => {
  try {
    const scenario = await scenarioService.createScenario(req.body);
    res.status(201).json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Create scenario error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
});

// Get all scenarios
router.get('/', async (req, res) => {
  try {
    const scenarios = await scenarioService.getScenarios();
    res.json({
      success: true,
      scenarios,
    });
  } catch (error) {
    console.error('Get scenarios error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
});

// Get scenario
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scenario = await scenarioService.getScenario(id);

    if (!scenario) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Scenario not found',
      });
    }

    res.json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Get scenario error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
});

// Update scenario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scenario = await scenarioService.updateScenario(id, req.body);

    if (!scenario) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Scenario not found',
      });
    }

    res.json({
      success: true,
      scenario,
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
});

// Delete scenario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await scenarioService.deleteScenario(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Scenario not found',
      });
    }

    res.json({
      success: true,
      message: 'Scenario deleted successfully',
    });
  } catch (error) {
    console.error('Delete scenario error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
});

// Apply scenario to proxy
router.post('/:id/apply/:proxyId', async (req, res) => {
  try {
    const { id, proxyId } = req.params;
    
    const proxy = await scenarioService.applyScenario(id, proxyId);
    if (!proxy) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Scenario or proxy not found',
      });
    }

    res.json({
      success: true,
      message: 'Scenario applied successfully',
      proxy,
    });
  } catch (error) {
    console.error('Apply scenario error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: error.message,
    });
  }
});

export default router;
