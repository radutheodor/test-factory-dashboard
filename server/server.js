// ════════════════════════════════════════════════════════════════
// Test Factory — Backend Server
// ════════════════════════════════════════════════════════════════
// Express.js backend that proxies API calls to external services
// (qTest, ServiceNow, SonarQube, Azure DevOps) and keeps
// credentials server-side. The Angular frontend calls these
// endpoints instead of the external APIs directly.
//
// Usage:
//   node server/server.js
//   # or with env vars:
//   QTEST_BASE_URL=https://myinstance.qtestnet.com \
//   QTEST_BEARER_TOKEN=abc123 \
//   node server/server.js
// ════════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const qtestService = require('./qtest.service');

const app = express();

// ── MIDDLEWARE ──
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// ── SERVE FRONTEND ──
// Serves test-factory-webapp.html at the root URL
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ════════════════════════════════════════════════════════════════
// qTest ENDPOINTS
// ════════════════════════════════════════════════════════════════

/**
 * GET /api/qtest/executions/:projectId
 *
 * Returns test executions from the last 31 days, grouped by release.
 *
 * Response:
 * {
 *   portalUrl: "https://abc.qtestnet.com/p/101/portal/project#tab=testexecution",
 *   releases: [
 *     {
 *       releaseName: "Release 3.2",
 *       passed: 198, failed: 12, blocked: 5, incomplete: 3, unexecuted: 30, total: 248
 *     }
 *   ]
 * }
 */
app.get('/api/qtest/executions/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if qTest is configured
    if (!config.qtest.bearerToken || config.qtest.bearerToken === 'REPLACE_WITH_YOUR_BEARER_TOKEN') {
      return res.status(503).json({
        error: 'qTest not configured',
        details: 'Set QTEST_BEARER_TOKEN environment variable or edit server/config.js',
        portalUrl: qtestService.getPortalUrl(projectId),
        releases: [],
      });
    }

    if (!config.qtest.baseUrl || config.qtest.baseUrl === 'https://abc.qtestnet.com') {
      return res.status(503).json({
        error: 'qTest not configured',
        details: 'Set QTEST_BASE_URL environment variable or edit server/config.js',
        portalUrl: qtestService.getPortalUrl(projectId),
        releases: [],
      });
    }

    const releases = await qtestService.getRecentTestExecutions(projectId);
    const portalUrl = qtestService.getPortalUrl(projectId);

    res.json({ portalUrl, releases });
  } catch (err) {
    console.error(`[qTest] Error fetching executions for project ${req.params.projectId}:`, err.message);
    res.status(502).json({
      error: 'Failed to fetch data from qTest',
      details: err.message,
      portalUrl: qtestService.getPortalUrl(req.params.projectId),
      releases: [],
    });
    });
  }
});

// ════════════════════════════════════════════════════════════════
// ServiceNow ENDPOINTS (future)
// ════════════════════════════════════════════════════════════════

/**
 * GET /api/servicenow/changes/:ciName
 *
 * Returns recent change requests for a given CI name.
 * TODO: Implement when ServiceNow integration is ready.
 */
app.get('/api/servicenow/changes/:ciName', (req, res) => {
  res.status(501).json({ error: 'ServiceNow integration not yet implemented' });
});

// ════════════════════════════════════════════════════════════════
// SonarQube ENDPOINTS (future)
// ════════════════════════════════════════════════════════════════

/**
 * GET /api/sonar/metrics/:projectKey
 *
 * Returns SonarQube metrics for a given project.
 * TODO: Implement when SonarQube integration is ready.
 */
app.get('/api/sonar/metrics/:projectKey', (req, res) => {
  res.status(501).json({ error: 'SonarQube integration not yet implemented' });
});

// ════════════════════════════════════════════════════════════════
// Azure DevOps ENDPOINTS (future)
// ════════════════════════════════════════════════════════════════

/**
 * GET /api/ado/pipelines/:project
 *
 * Returns recent pipeline runs for a given ADO project.
 * TODO: Implement when ADO integration is ready.
 */
app.get('/api/ado/pipelines/:project', (req, res) => {
  res.status(501).json({ error: 'Azure DevOps integration not yet implemented' });
});

// ── START SERVER ──
app.listen(config.port, () => {
  console.log(`\n  ╔══════════════════════════════════════════════╗`);
  console.log(`  ║  Test Factory running on http://localhost:${config.port}  ║`);
  console.log(`  ╚══════════════════════════════════════════════╝`);
  console.log(`  qTest base URL: ${config.qtest.baseUrl}`);
  console.log(`  Frontend:       http://localhost:${config.port}\n`);
});
