// ════════════════════════════════════════════════════════════════
// qTest Service (Backend)
// ════════════════════════════════════════════════════════════════
// Uses Node.js built-in https/http modules (works on all Node versions).
// No external dependencies needed.
// ════════════════════════════════════════════════════════════════

const https = require('https');
const http = require('http');
const { URL } = require('url');
const config = require('./config');

/**
 * Makes an HTTPS/HTTP GET request and returns a Promise with the parsed JSON body.
 */
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

    console.log(`[qTest] GET ${parsed.hostname}${parsed.pathname}${parsed.search}`);

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[qTest] Response: ${res.statusCode} (${body.length} bytes)`);
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

    req.on('error', (err) => {
      console.error(`[qTest] Request error:`, err.message);
      reject(new Error(`Network error calling qTest: ${err.message}`));
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('qTest API request timed out after 15 seconds'));
    });

    req.end();
  });
}

/**
 * Fetches test runs from qTest for a given project, filters to last 31 days,
 * groups by release, and returns aggregated execution data.
 */
async function getRecentTestExecutions(projectId) {
  const url = `${config.qtest.baseUrl}/api/v3/projects/${projectId}/test-runs?parentId=0&parentType=root&expand=descendants`;

  const data = await httpGet(url, {
    'Authorization': `Bearer ${config.qtest.bearerToken}`,
    'Content-Type': 'application/json',
  });

  // qTest may return { items: [...], total, ... } or a flat array
  const items = Array.isArray(data) ? data : (data.items || []);
  console.log(`[qTest] Received ${items.length} total test runs for project ${projectId}`);

  // Calculate 31-day cutoff
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 31);

  // Filter to last 31 days based on last_modified_date
  const recentRuns = items.filter(run => {
    if (!run.last_modified_date) return false;
    return new Date(run.last_modified_date) >= cutoff;
  });
  console.log(`[qTest] ${recentRuns.length} test runs in the last 31 days`);

  // Group by Target Release/Build and tally statuses
  const releaseMap = {};

  recentRuns.forEach(run => {
    const properties = run.properties || [];

    // Find "Target Release/Build" property
    let releaseName = 'Unassigned';
    const relProp = properties.find(p => p.field_name === 'Target Release/Build');
    if (relProp && relProp.field_value_name) {
      releaseName = relProp.field_value_name;
    }

    // Find "Status" property
    let status = 'Unexecuted';
    const statusProp = properties.find(p => p.field_name === 'Status');
    if (statusProp && statusProp.field_value_name) {
      status = statusProp.field_value_name;
    }

    if (!releaseMap[releaseName]) {
      releaseMap[releaseName] = {
        releaseName,
        passed: 0, failed: 0, blocked: 0, incomplete: 0, unexecuted: 0, total: 0,
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

/**
 * Returns the qTest portal URL for a project's test execution tab.
 */
function getPortalUrl(projectId) {
  return `${config.qtest.baseUrl}/p/${projectId}/portal/project#tab=testexecution`;
}

module.exports = { getRecentTestExecutions, getPortalUrl };
