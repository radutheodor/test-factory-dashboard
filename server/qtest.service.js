// ════════════════════════════════════════════════════════════════
// qTest Service (Backend)
// ════════════════════════════════════════════════════════════════
// Calls the qTest API, filters Test Runs to the last 31 days,
// groups by Target Release/Build, and tallies statuses.
//
// This runs server-side so the bearer token never reaches the browser.
// ════════════════════════════════════════════════════════════════

const config = require('./config');

/**
 * Fetches test runs from qTest for a given project, filters to last 31 days,
 * groups by release, and returns aggregated execution data.
 *
 * @param {number|string} projectId - qTest project ID
 * @returns {Promise<Array>} Array of release execution summaries
 */
async function getRecentTestExecutions(projectId) {
  const url = `${config.qtest.baseUrl}/api/v3/projects/${projectId}/test-runs?parentId=0&parentType=root&expand=descendants`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${config.qtest.bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`qTest API returned ${response.status}: ${body.substring(0, 200)}`);
  }

  const data = await response.json();

  // qTest may return { items: [...] } or a flat array depending on version
  const items = Array.isArray(data) ? data : (data.items || []);

  // Calculate 31-day cutoff
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 31);

  // Filter to last 31 days based on last_modified_date
  const recentRuns = items.filter(run => {
    if (!run.last_modified_date) return false;
    return new Date(run.last_modified_date) >= cutoff;
  });

  // Group by Target Release/Build and tally statuses
  const releaseMap = {};

  recentRuns.forEach(run => {
    const properties = run.properties || [];

    // Find "Target Release/Build" property
    // Properties is an array of { field_id, field_name, field_value, field_value_name }
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

    // Initialise release group if not yet present
    if (!releaseMap[releaseName]) {
      releaseMap[releaseName] = {
        releaseName,
        passed: 0,
        failed: 0,
        blocked: 0,
        incomplete: 0,
        unexecuted: 0,
        total: 0,
      };
    }

    // Tally
    const r = releaseMap[releaseName];
    r.total++;
    const s = status.toLowerCase();
    if (s === 'passed') r.passed++;
    else if (s === 'failed') r.failed++;
    else if (s === 'blocked') r.blocked++;
    else if (s === 'incomplete') r.incomplete++;
    else r.unexecuted++; // Unexecuted or any unrecognised status
  });

  return Object.values(releaseMap);
}

/**
 * Returns the qTest portal URL for a project's test execution tab.
 */
function getPortalUrl(projectId) {
  return `${config.qtest.baseUrl}/p/${projectId}/portal/project#tab=testexecution`;
}

module.exports = { getRecentTestExecutions, getPortalUrl };
