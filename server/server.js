// ════════════════════════════════════════════════════════════════
// Test Factory — Backend Server
// ════════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const qtestService = require('./qtest.service');
const { PRODUCT_TEAMS } = require('./config/teams.config');

const app = express();

// ── MIDDLEWARE ──
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// ── SERVE FRONTEND ──
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ════════════════════════════════════════════════════════════════
// TEAMS ENDPOINT
// ════════════════════════════════════════════════════════════════

/**
 * GET /api/teams
 * Returns the full list of product teams from the central config.
 * This is the single source of truth for the frontend.
 */
app.get('/api/teams', (req, res) => {
  res.json({ teams: PRODUCT_TEAMS });
});

// ════════════════════════════════════════════════════════════════
// qTest ENDPOINTS
// ════════════════════════════════════════════════════════════════

// Small helper: is qTest configured?
function isQTestConfigured() {
  return config.qtest.bearerToken &&
         config.qtest.bearerToken !== 'REPLACE_WITH_YOUR_BEARER_TOKEN' &&
         config.qtest.baseUrl &&
         config.qtest.baseUrl !== 'https://abc.qtestnet.com';
}

/**
 * GET /api/qtest/executions/:projectId
 * Paginated Test Runs, filtered to last 31 days, grouped by release.
 */
app.get('/api/qtest/executions/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const portalUrl = qtestService.getPortalUrl(projectId);

  if (!isQTestConfigured()) {
    return res.status(503).json({
      error: 'qTest not configured',
      details: 'Set QTEST_BASE_URL and QTEST_BEARER_TOKEN environment variables, or edit server/config.js',
      portalUrl,
      releases: [],
    });
  }

  try {
    const releases = await qtestService.getRecentTestExecutions(projectId);
    res.json({ portalUrl, releases });
  } catch (err) {
    console.error(`[qTest] Error fetching executions for project ${projectId}:`, err.message);
    res.status(502).json({
      error: 'Failed to fetch data from qTest',
      details: err.message,
      portalUrl,
      releases: [],
    });
  }
});

/**
 * GET /api/qtest/requirements-coverage/:projectId
 * Parses the "Traceability Matrix" folder recursively and returns aggregated coverage stats.
 */
app.get('/api/qtest/requirements-coverage/:projectId', async (req, res) => {
  const { projectId } = req.params;

  if (!isQTestConfigured()) {
    return res.status(503).json({
      error: 'qTest not configured',
      details: 'Set QTEST_BASE_URL and QTEST_BEARER_TOKEN environment variables, or edit server/config.js',
      found: false,
      totalRequirements: 0,
      coveredRequirements: 0,
      uncoveredRequirements: 0,
      totalTestsCovering: 0,
      coveragePercentage: 0,
    });
  }

  try {
    const coverage = await qtestService.getRequirementsCoverage(projectId);
    res.json(coverage);
  } catch (err) {
    console.error(`[qTest] Error fetching requirements coverage for project ${projectId}:`, err.message);
    res.status(502).json({
      error: 'Failed to fetch requirements coverage from qTest',
      details: err.message,
      found: false,
      totalRequirements: 0,
      coveredRequirements: 0,
      uncoveredRequirements: 0,
      totalTestsCovering: 0,
      coveragePercentage: 0,
    });
  }
});

// ════════════════════════════════════════════════════════════════
// FUTURE ENDPOINTS (stubs)
// ════════════════════════════════════════════════════════════════
app.get('/api/servicenow/changes/:ciName', (req, res) => res.status(501).json({ error: 'Not yet implemented' }));
app.get('/api/sonar/metrics/:projectKey',  (req, res) => res.status(501).json({ error: 'Not yet implemented' }));
app.get('/api/ado/pipelines/:project',     (req, res) => res.status(501).json({ error: 'Not yet implemented' }));

// ── START SERVER ──
app.listen(config.port, () => {
  console.log(`\n  ╔══════════════════════════════════════════════╗`);
  console.log(`  ║  Test Factory running on http://localhost:${config.port}  ║`);
  console.log(`  ╚══════════════════════════════════════════════╝`);
  console.log(`  Node.js:        ${process.version}`);
  console.log(`  qTest base URL: ${config.qtest.baseUrl}`);
  console.log(`  qTest token:    ${isQTestConfigured() ? '✓ configured (' + config.qtest.bearerToken.substring(0, 8) + '...)' : '⚠ NOT CONFIGURED'}`);
  console.log(`  Teams loaded:   ${PRODUCT_TEAMS.length} (from server/config/teams.config.js)`);
  console.log(`  Frontend:       http://localhost:${config.port}\n`);
});
