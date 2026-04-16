// ════════════════════════════════════════════════════════════════
// qTest Models (Frontend)
// ════════════════════════════════════════════════════════════════

/** Aggregated test execution data for a single release, as returned by the backend */
export interface QTestReleaseExecution {
  releaseName: string;
  passed: number;
  failed: number;
  blocked: number;
  incomplete: number;
  unexecuted: number;
  total: number;
}

/** Response from GET /api/qtest/executions/:projectId */
export interface QTestExecutionsResponse {
  portalUrl: string;
  releases: QTestReleaseExecution[];
}

/** Status colours used in the execution bar */
export const QTEST_STATUS_COLORS: Record<string, string> = {
  passed:     '#10B981',  // green
  failed:     '#EF4444',  // red
  blocked:    '#D4890B',  // dark orange
  incomplete: '#F59E0B',  // yellow/amber
  unexecuted: '#D9D9D9',  // silver/grey
};
