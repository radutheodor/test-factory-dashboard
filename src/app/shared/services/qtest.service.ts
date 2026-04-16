// ════════════════════════════════════════════════════════════════
// qTest Service
// ════════════════════════════════════════════════════════════════
// Fetches Test Runs from qTest API, filters to last 31 days,
// groups by Target Release/Build, and tallies statuses.
// ════════════════════════════════════════════════════════════════

import { QTEST_CONFIG } from '../config/qtest.config';

export interface QTestReleaseExecution {
  name: string;       // Release name from "Target Release/Build" property
  passed: number;
  failed: number;
  blocked: number;
  incomplete: number;
  unexecuted: number;
  total: number;
}

/**
 * Fetches all Test Runs for a project, filters to last 31 days,
 * groups by release, and counts statuses.
 *
 * API endpoint: GET /api/v3/projects/{projectId}/test-runs?parentId=0&parentType=root&expand=descendants
 *
 * @param projectId - qTest project ID (from teams.config.ts)
 * @returns Array of release executions, or null if API call fails
 */
export async function fetchQTestRunsForProject(projectId: number): Promise<QTestReleaseExecution[] | null> {
  try {
    const url = `${QTEST_CONFIG.baseUrl}/api/v3/projects/${projectId}/test-runs?parentId=0&parentType=root&expand=descendants`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${QTEST_CONFIG.bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`qTest API returned ${response.status}`);
    }

    const data = await response.json();

    // Calculate 31-day cutoff
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 31);

    const items: any[] = Array.isArray(data) ? data : (data.items || []);

    // Filter to last 31 days based on last_modified_date
    const recentRuns = items.filter((run: any) => {
      if (!run.last_modified_date) return false;
      return new Date(run.last_modified_date) >= cutoff;
    });

    // Group by Release Name and count statuses
    const releaseMap: Record<string, QTestReleaseExecution> = {};

    recentRuns.forEach((run: any) => {
      const properties: any[] = run.properties || [];

      // Find "Target Release/Build" property
      let releaseName = 'Unassigned';
      const relProp = properties.find((p: any) => p.field_name === 'Target Release/Build');
      if (relProp?.field_value_name) {
        releaseName = relProp.field_value_name;
      }

      // Find "Status" property
      let status = 'Unexecuted';
      const statusProp = properties.find((p: any) => p.field_name === 'Status');
      if (statusProp?.field_value_name) {
        status = statusProp.field_value_name;
      }

      // Initialise release group
      if (!releaseMap[releaseName]) {
        releaseMap[releaseName] = {
          name: releaseName,
          passed: 0, failed: 0, blocked: 0, incomplete: 0, unexecuted: 0, total: 0,
        };
      }

      // Tally status
      const r = releaseMap[releaseName];
      r.total++;
      const s = status.toLowerCase();
      if (s === 'passed') r.passed++;
      else if (s === 'failed') r.failed++;
      else if (s === 'blocked') r.blocked++;
      else if (s === 'incomplete') r.incomplete++;
      else r.unexecuted++;
    });

    return Object.values(releaseMap);
  } catch (err) {
    console.error('qTest API error:', err);
    return null;
  }
}

/**
 * Builds the qTest portal URL for a project's test execution tab.
 */
export function getQTestPortalUrl(projectId: number): string {
  return `${QTEST_CONFIG.baseUrl}/p/${projectId}/portal/project#tab=testexecution`;
}
