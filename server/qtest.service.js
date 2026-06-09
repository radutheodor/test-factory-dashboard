// ════════════════════════════════════════════════════════════════
// qTest Service (Backend)
// ════════════════════════════════════════════════════════════════
// Uses axios for HTTP calls, with PARALLEL pagination:
//   1. Fetch page 1 synchronously
//   2. If the response includes `total`, calculate remaining pages
//      and fetch them all in parallel (Promise.all)
//   3. If `total` is missing, fall back to sequential pagination
//      (loop until a page returns < pageSize items)
//
// This reduces end-to-end time from ~N × latency (sequential)
// to ~1 × latency (parallel) for the common case.
// ════════════════════════════════════════════════════════════════

const axios = require('axios');
const config = require('./config');

const PAGE_SIZE = 999;
const PARALLEL_LIMIT = 10; // cap concurrent in-flight requests

// Configured axios instance — reuses TCP connections (keep-alive)
// and sets sensible defaults once
const http = require('http');
const https = require('https');

const qtestClient = axios.create({
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${config.qtest.bearerToken}`,
    'Content-Type': 'application/json',
  },
  // Keep-alive agents: reuse connections across page fetches
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 20 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 20 }),
});

// ────────────────────────────────────────────────────────────────
// Helper: fetch a single page
// ────────────────────────────────────────────────────────────────
async function fetchPage(buildUrl, page) {
  const url = buildUrl(page, PAGE_SIZE);
  const t0 = Date.now();
  const { data } = await qtestClient.get(url);
  const elapsed = Date.now() - t0;
  const items = Array.isArray(data) ? data : (data.items || []);
  console.log(`[qTest]   page ${page}: ${items.length} items in ${elapsed}ms${data.total !== undefined ? ` (total=${data.total})` : ''}`);
  return { items, total: data.total, pageSize: data.page_size };
}

// ────────────────────────────────────────────────────────────────
// Helper: run promises in parallel with a concurrency limit
// ────────────────────────────────────────────────────────────────
async function parallelLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ────────────────────────────────────────────────────────────────
// Generic paginated fetch — PARALLEL when total is known,
// sequential fallback otherwise.
// ────────────────────────────────────────────────────────────────
async function fetchAllPages(buildUrl, endpointLabel) {
  console.log(`[qTest] Fetching all pages for ${endpointLabel}`);
  const t0 = Date.now();

  // Always fetch page 1 first to discover total
  const first = await fetchPage(buildUrl, 1);
  const allItems = [...first.items];

  // Case 1: total known and there are more pages → PARALLEL
  if (typeof first.total === 'number' && first.total > PAGE_SIZE) {
    const totalPages = Math.ceil(first.total / PAGE_SIZE);
    console.log(`[qTest]   → ${first.total} total items, ${totalPages} pages — fetching pages 2-${totalPages} in parallel (limit=${PARALLEL_LIMIT})`);

    const tasks = [];
    for (let page = 2; page <= totalPages; page++) {
      const p = page;
      tasks.push(() => fetchPage(buildUrl, p));
    }

    const pageResults = await parallelLimit(tasks, PARALLEL_LIMIT);
    pageResults.forEach(r => allItems.push(...r.items));
  }
  // Case 2: no total → sequential fallback (stop when a page < pageSize)
  else if (first.items.length === PAGE_SIZE) {
    console.log(`[qTest]   → no "total" in response, falling back to sequential pagination`);
    let page = 2;
    while (true) {
      const r = await fetchPage(buildUrl, page);
      allItems.push(...r.items);
      if (r.items.length < PAGE_SIZE) break;
      page++;
      if (page > 1000) { console.warn('[qTest] Safety cap at page 1000'); break; }
    }
  }

  const elapsed = Date.now() - t0;
  console.log(`[qTest] Fetched ${allItems.length} items from ${endpointLabel} in ${elapsed}ms`);
  return allItems;
}

// ────────────────────────────────────────────────────────────────
// TEST EXECUTIONS — Last 31 days, grouped by Release
// ────────────────────────────────────────────────────────────────
async function getRecentTestExecutions(projectId) {
  const allRuns = await fetchAllPages(
    (page, size) => `${config.qtest.baseUrl}/api/v3/projects/${projectId}/test-runs?parentId=0&parentType=root&expand=descendants&page=${page}&pageSize=${size}`,
    `test-runs (project ${projectId})`
  );

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 31);

  const recentRuns = allRuns.filter(run => {
    if (!run.last_modified_date) return false;
    return new Date(run.last_modified_date) >= cutoff;
  });
  console.log(`[qTest] ${recentRuns.length} of ${allRuns.length} test runs are within the last 31 days`);

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

function walkRequirements(node, stats) {
  if (!node || typeof node !== 'object') return;

  const reqs = node.requirements || [];
  reqs.forEach(req => {
    stats.total++;
    const linked = req['linked-testcases'];
    if (typeof linked === 'number' && linked > 0) {
      stats.covered++;
      stats.testCases += linked;
    } else {
      stats.uncovered++;
    }
  });

  const children = node.children || [];
  children.forEach(child => walkRequirements(child, stats));
}

async function getRequirementsCoverage(projectId) {
  const allRoots = await fetchAllPages(
    (page, size) => `${config.qtest.baseUrl}/api/v3/projects/${projectId}/requirements/trace-matrix-report?page=${page}&size=${size}&expand=descendants`,
    `trace-matrix-report (project ${projectId})`
  );

  const matrixRoot = allRoots.find(root =>
    root && root.name && root.name.includes('Traceability Matrix')
  );

  if (!matrixRoot) {
    console.log(`[qTest] No "Traceability Matrix" folder found at root for project ${projectId}`);
    return {
      found: false,
      totalRequirements: 0, coveredRequirements: 0, uncoveredRequirements: 0,
      totalTestsCovering: 0, coveragePercentage: 0,
    };
  }

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

function getPortalUrl(projectId) {
  return `${config.qtest.baseUrl}/p/${projectId}/portal/project#tab=testexecution`;
}

module.exports = {
  getRecentTestExecutions,
  getRequirementsCoverage,
  getPortalUrl,
};
