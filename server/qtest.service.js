// ════════════════════════════════════════════════════════════════
// qTest Service (Backend)
// ════════════════════════════════════════════════════════════════
// Uses Node.js built-in https/http modules — no external deps.
//
// Provides:
//   - getRecentTestExecutions(projectId): paginated Test Runs, filtered
//     to last 31 days, grouped by Target Release/Build
//   - getRequirementsCoverage(projectId): recursive walk of the
//     Traceability Matrix folder, sums requirements + test coverage
// ════════════════════════════════════════════════════════════════

const https = require('https');
const http = require('http');
const { URL } = require('url');
const config = require('./config');

const PAGE_SIZE = 999;

// ────────────────────────────────────────────────────────────────
// HTTP helper (promise-based GET)
// ────────────────────────────────────────────────────────────────
function httpGet(urlString, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlString);
    const client = parsed.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: headers || {},
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Failed to parse qTest response as JSON: ${body.substring(0, 200)}`));
          }
        } else {
          reject(new Error(`qTest API returned HTTP ${res.statusCode}: ${body.substring(0, 300)}`));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network error calling qTest: ${err.message}`)));
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('qTest API request timed out after 30 seconds'));
    });
    req.end();
  });
}

// ────────────────────────────────────────────────────────────────
// Generic paginated fetch — follows pages until one returns fewer
// items than pageSize. Works for any qTest endpoint with page/pageSize
// pagination, regardless of whether the response includes `total`.
// ────────────────────────────────────────────────────────────────
async function fetchAllPages(buildUrl, headers, endpointLabel) {
  const allItems = [];
  let page = 1;

  while (true) {
    const url = buildUrl(page, PAGE_SIZE);
    console.log(`[qTest] GET ${endpointLabel} page=${page} pageSize=${PAGE_SIZE}`);

    const data = await httpGet(url, headers);
    const items = Array.isArray(data) ? data : (data.items || []);

    console.log(`[qTest]   → received ${items.length} items${data.total !== undefined ? ` (total=${data.total})` : ''}`);
    allItems.push(...items);

    // Stop when a page returns fewer items than pageSize — that's the last page.
    // Generic: works even when the response has no `total` field.
    if (items.length < PAGE_SIZE) break;

    page++;

    // Safety cap to prevent runaway loops (≈ 1M items)
    if (page > 1000) {
      console.warn(`[qTest] Pagination safety cap reached at page ${page}, stopping`);
      break;
    }
  }

  console.log(`[qTest] Fetched ${allItems.length} total items from ${endpointLabel} across ${page} page(s)`);
  return allItems;
}

// ────────────────────────────────────────────────────────────────
// TEST EXECUTIONS — Last 31 days, grouped by Release
// ────────────────────────────────────────────────────────────────
async function getRecentTestExecutions(projectId) {
  const headers = {
    'Authorization': `Bearer ${config.qtest.bearerToken}`,
    'Content-Type': 'application/json',
  };

  // Fetch all pages of test runs
  const allRuns = await fetchAllPages(
    (page, size) => `${config.qtest.baseUrl}/api/v3/projects/${projectId}/test-runs?parentId=0&parentType=root&expand=descendants&page=${page}&pageSize=${size}`,
    headers,
    `test-runs (project ${projectId})`
  );

  // Filter to last 31 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 31);

  const recentRuns = allRuns.filter(run => {
    if (!run.last_modified_date) return false;
    return new Date(run.last_modified_date) >= cutoff;
  });
  console.log(`[qTest] ${recentRuns.length} of ${allRuns.length} test runs are within the last 31 days`);

  // Group by Target Release/Build and tally statuses
  const releaseMap = {};

  recentRuns.forEach(run => {
    const properties = run.properties || [];

    let releaseName = 'Unassigned';
    const relProp = properties.find(p => p.field_name === 'Target Release/Build');
    if (relProp && relProp.field_value_name) releaseName = relProp.field_value_name;

    let status = 'Unexecuted';
    const statusProp = properties.find(p => p.field_name === 'Status');
    if (statusProp && statusProp.field_value_name) status = statusProp.field_value_name;

    if (!releaseMap[releaseName]) {
      releaseMap[releaseName] = {
        releaseName, passed: 0, failed: 0, blocked: 0, incomplete: 0, unexecuted: 0, total: 0,
      };
    }

    const r = releaseMap[releaseName];
    r.total++;
    const s = status.toLowerCase();
    if (s === 'passed') r.passed++;
    else if (s === 'failed') r.failed++;
    else if (s === 'blocked') r.blocked++;
    else if (s === 'incomplete') r.incomplete++;
    else r.unexecuted++;
  });

  const releases = Object.values(releaseMap);
  console.log(`[qTest] Grouped into ${releases.length} release(s):`, releases.map(r => `${r.releaseName} (${r.total})`).join(', '));

  return releases;
}

// ────────────────────────────────────────────────────────────────
// REQUIREMENTS COVERAGE — Recursive walk of Traceability Matrix
// ────────────────────────────────────────────────────────────────

/**
 * Recursively walks a folder/requirements node tree and accumulates stats.
 *
 * Node shape (flexible):
 *   { id, name, requirements: [...], children: [...] }
 *
 * Requirement entry shape:
 *   { id, name }                                    ← uncovered (no test cases)
 *   { id, name, testcases, 'linked-testcases': N }  ← covered by N test cases
 *
 * @param node - Current folder node to process
 * @param stats - Accumulator object { total, covered, uncovered, testCases }
 */
function walkRequirements(node, stats) {
  if (!node || typeof node !== 'object') return;

  // Process requirements in this node
  const reqs = node.requirements || [];
  reqs.forEach(req => {
    stats.total++;
    // "linked-testcases" (hyphenated) = number of test cases covering this requirement
    const linked = req['linked-testcases'];
    if (typeof linked === 'number' && linked > 0) {
      stats.covered++;
      stats.testCases += linked;
    } else {
      stats.uncovered++;
    }
  });

  // Recurse into children (sub-folders)
  const children = node.children || [];
  children.forEach(child => walkRequirements(child, stats));
}

async function getRequirementsCoverage(projectId) {
  const headers = {
    'Authorization': `Bearer ${config.qtest.bearerToken}`,
    'Content-Type': 'application/json',
  };

  // Fetch all pages of the trace matrix report (note: uses "size" not "pageSize")
  const allRoots = await fetchAllPages(
    (page, size) => `${config.qtest.baseUrl}/api/v3/projects/${projectId}/requirements/trace-matrix-report?page=${page}&size=${size}&expand=descendants`,
    headers,
    `trace-matrix-report (project ${projectId})`
  );

  // Find the root entry whose name contains "Traceability Matrix"
  const matrixRoot = allRoots.find(root =>
    root && root.name && root.name.includes('Traceability Matrix')
  );

  if (!matrixRoot) {
    console.log(`[qTest] No "Traceability Matrix" folder found at root for project ${projectId}`);
    return {
      found: false,
      totalRequirements: 0,
      coveredRequirements: 0,
      uncoveredRequirements: 0,
      totalTestsCovering: 0,
      coveragePercentage: 0,
    };
  }

  // Walk the matrix recursively
  const stats = { total: 0, covered: 0, uncovered: 0, testCases: 0 };
  walkRequirements(matrixRoot, stats);

  const coveragePercentage = stats.total > 0 ? Math.round((stats.covered / stats.total) * 1000) / 10 : 0;

  console.log(`[qTest] Coverage for project ${projectId}: ${stats.covered}/${stats.total} requirements covered by ${stats.testCases} test cases (${coveragePercentage}%)`);

  return {
    found: true,
    totalRequirements: stats.total,
    coveredRequirements: stats.covered,
    uncoveredRequirements: stats.uncovered,
    totalTestsCovering: stats.testCases,
    coveragePercentage,
  };
}

// ────────────────────────────────────────────────────────────────
// Portal URL helper
// ────────────────────────────────────────────────────────────────
function getPortalUrl(projectId) {
  return `${config.qtest.baseUrl}/p/${projectId}/portal/project#tab=testexecution`;
}

module.exports = {
  getRecentTestExecutions,
  getRequirementsCoverage,
  getPortalUrl,
};
