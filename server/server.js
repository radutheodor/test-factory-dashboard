// ════════════════════════════════════════════════════════════════
// Test Factory — Backend Server
// ════════════════════════════════════════════════════════════════

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const qtestService = require('./qtest.service');
const assessmentsService = require('./assessments.service');
const { PRODUCT_TEAMS } = require('./config/teams.config');
const { DIMENSIONS, MATURITY_LEVELS, QUESTIONS } = require('./config/maturity.config');
const { ROADMAP_PHASES } = require('./config/roadmap.config');

const app = express();

app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// ── STATIC FRONTEND ──
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ════════════════════════════════════════════════════════════════
// CONFIG ENDPOINTS
// ════════════════════════════════════════════════════════════════
app.get('/api/teams', (req, res) => res.json({ teams: PRODUCT_TEAMS }));

app.get('/api/maturity-config', (req, res) => {
  res.json({ dimensions: DIMENSIONS, levels: MATURITY_LEVELS, questions: QUESTIONS });
});

app.get('/api/roadmap-config', (req, res) => {
  res.json({ phases: ROADMAP_PHASES });
});

// ════════════════════════════════════════════════════════════════
// ASSESSMENT ENDPOINTS (SQLite-backed)
// ════════════════════════════════════════════════════════════════
app.get('/api/assessments', (req, res) => {
  try {
    res.json({ assessments: assessmentsService.getAllAssessments() });
  } catch (err) {
    console.error('[DB] Error listing assessments:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/api/assessments/latest/:teamId', (req, res) => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    if (isNaN(teamId)) return res.status(400).json({ error: 'Invalid team ID' });
    const result = assessmentsService.getLatestForTeam(teamId);
    if (!result) return res.status(404).json({ error: 'No assessments found for this team' });
    res.json(result);
  } catch (err) {
    console.error('[DB] Error fetching latest:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/api/assessments/:id', (req, res) => {
  try {
    const result = assessmentsService.getAssessmentById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Assessment not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.post('/api/assessments', (req, res) => {
  try {
    const result = req.body;
    if (!result || !result.id || !result.teamId || !result.team) {
      return res.status(400).json({ error: 'Invalid assessment payload' });
    }
    const saved = assessmentsService.saveAssessment(result);
    res.status(201).json(saved);
  } catch (err) {
    console.error('[DB] Error saving assessment:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.delete('/api/assessments/:id', (req, res) => {
  try {
    const ok = assessmentsService.deleteAssessment(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Assessment not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// ════════════════════════════════════════════════════════════════
// qTest ENDPOINTS
// ════════════════════════════════════════════════════════════════
function isQTestConfigured() {
  return config.qtest.bearerToken &&
         config.qtest.bearerToken !== 'REPLACE_WITH_YOUR_BEARER_TOKEN' &&
         config.qtest.baseUrl &&
         config.qtest.baseUrl !== 'https://abc.qtestnet.com';
}

app.get('/api/qtest/executions/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const portalUrl = qtestService.getPortalUrl(projectId);
  if (!isQTestConfigured()) {
    return res.status(503).json({
      error: 'qTest not configured',
      details: 'Set QTEST_BASE_URL and QTEST_BEARER_TOKEN or edit server/config.js',
      portalUrl, releases: [],
    });
  }
  try {
    const releases = await qtestService.getRecentTestExecutions(projectId);
    res.json({ portalUrl, releases });
  } catch (err) {
    console.error(`[qTest] Error fetching executions for project ${projectId}:`, err.message);
    res.status(502).json({ error: 'Failed to fetch data from qTest', details: err.message, portalUrl, releases: [] });
  }
});

app.get('/api/qtest/requirements-coverage/:projectId', async (req, res) => {
  const { projectId } = req.params;
  if (!isQTestConfigured()) {
    return res.status(503).json({
      error: 'qTest not configured',
      details: 'Set QTEST_BASE_URL and QTEST_BEARER_TOKEN or edit server/config.js',
      found: false, totalRequirements: 0, coveredRequirements: 0, uncoveredRequirements: 0,
      totalTestsCovering: 0, coveragePercentage: 0,
    });
  }
  try {
    const coverage = await qtestService.getRequirementsCoverage(projectId);
    res.json(coverage);
  } catch (err) {
    console.error(`[qTest] Error fetching requirements coverage for project ${projectId}:`, err.message);
    res.status(502).json({
      error: 'Failed to fetch requirements coverage from qTest', details: err.message,
      found: false, totalRequirements: 0, coveredRequirements: 0, uncoveredRequirements: 0,
      totalTestsCovering: 0, coveragePercentage: 0,
    });
  }
});

// ── FUTURE ENDPOINTS (stubs) ──
app.get('/api/servicenow/changes/:ciName', (req, res) => res.status(501).json({ error: 'Not yet implemented' }));
app.get('/api/sonar/metrics/:projectKey',  (req, res) => res.status(501).json({ error: 'Not yet implemented' }));
app.get('/api/ado/pipelines/:project',     (req, res) => res.status(501).json({ error: 'Not yet implemented' }));

// ── START ──
app.listen(config.port, () => {
  console.log(`\n  ╔══════════════════════════════════════════════╗`);
  console.log(`  ║  Test Factory running on http://localhost:${config.port}  ║`);
  console.log(`  ╚══════════════════════════════════════════════╝`);
  console.log(`  Node.js:        ${process.version}`);
  console.log(`  qTest base URL: ${config.qtest.baseUrl}`);
  console.log(`  qTest token:    ${isQTestConfigured() ? '✓ configured (' + config.qtest.bearerToken.substring(0, 8) + '...)' : '⚠ NOT CONFIGURED'}`);
  console.log(`  Teams loaded:   ${PRODUCT_TEAMS.length} (server/config/teams.config.js)`);
  console.log(`  Questions:      ${QUESTIONS.length} across ${DIMENSIONS.length} dimensions`);
  console.log(`  Frontend:       http://localhost:${config.port}\n`);
});
