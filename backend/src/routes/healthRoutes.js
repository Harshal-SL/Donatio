const express = require('express');
const router = express.Router();
const supabaseKeepAlive = require('../services/supabaseKeepAlive');

/**
 * GET /health or /api/health
 * Basic server health check
 */
router.get('/', (req, res) => {
  const keepAliveStatus = supabaseKeepAlive.getStatus();

  res.json({
    success: true,
    status: 'healthy',
    service: 'Donate Connect API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    supabaseKeepAlive: {
      schedule: `Every ${keepAliveStatus.intervalDays} days (${keepAliveStatus.intervalHours} hours)`,
      totalPings: keepAliveStatus.totalPings,
      lastPing: keepAliveStatus.lastPing
    }
  });
});

/**
 * GET /health/supabase or /api/health/supabase
 * Performs an on-demand read request to Supabase to reset the 7-day inactivity pause
 */
router.get('/supabase', async (req, res) => {
  const result = await supabaseKeepAlive.ping();

  if (!result.success) {
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      service: 'supabase',
      error: result.error,
      durationMs: result.durationMs,
      timestamp: result.timestamp
    });
  }

  return res.json({
    success: true,
    status: 'healthy',
    service: 'supabase',
    message: 'Supabase read request completed successfully. Inactivity timer reset.',
    durationMs: result.durationMs,
    timestamp: result.timestamp,
    totalPings: result.totalPings
  });
});

/**
 * GET /health/status or /api/health/status
 * Returns full diagnostics of the keep-alive background service
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    keepAlive: supabaseKeepAlive.getStatus()
  });
});

module.exports = router;
