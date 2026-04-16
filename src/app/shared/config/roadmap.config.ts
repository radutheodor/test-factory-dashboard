// ════════════════════════════════════════════════════════════════
// ROADMAP ACTION LIBRARY
// ════════════════════════════════════════════════════════════════
// Actions keyed by dimension ID. Each action has a maxScore threshold:
// if a team's dimension score is ≤ maxScore, the action is relevant.
// ════════════════════════════════════════════════════════════════

export interface RoadmapAction {
  maxScore: number;
  title: string;
  desc: string;
  effort: string;
  tags: string[];
}

export const ROADMAP_ACTIONS: Record<string, RoadmapAction[]> = {
  strategy: [
    { maxScore: 1, title: 'Create a formal test strategy document', desc: 'Define test types, scope, tools, environments, and risk approach. Align with product architecture.', effort: '1–2 weeks', tags: ['Foundation', 'Documentation'] },
    { maxScore: 2, title: 'Integrate testing into Definition of Done', desc: 'Add specific test criteria (unit tests, code review, CI green) to the team DoD and enforce in sprint reviews.', effort: '1 sprint', tags: ['Process', 'Quick Win'] },
    { maxScore: 3, title: 'Implement risk-based test prioritisation', desc: 'Create a risk matrix mapping business impact × likelihood of failure. Use it to prioritise regression tests.', effort: '2–3 weeks', tags: ['Strategy', 'Risk'] },
    { maxScore: 4, title: 'Automate risk scoring from code changes', desc: 'Use code change metrics (files changed, complexity delta) to auto-score risk and adjust test selection.', effort: '1–2 months', tags: ['Advanced', 'Automation'] },
  ],
  unit: [
    { maxScore: 1, title: 'Establish unit testing practice', desc: 'Set up a test framework (JUnit/Jest/pytest), write tests for new code, target 20% coverage.', effort: '1–2 weeks', tags: ['Foundation', 'Quick Win'] },
    { maxScore: 2, title: 'Integrate unit tests into CI pipeline', desc: 'Configure CI to run unit tests on every PR. Make failures block merge.', effort: '1–2 days', tags: ['CI/CD', 'Quick Win'] },
    { maxScore: 3, title: 'Set up coverage gating in CI', desc: 'Configure SonarQube quality gate with minimum coverage threshold (40%+).', effort: '1–2 days', tags: ['Quality Gate', 'Quick Win'] },
    { maxScore: 4, title: 'Add mutation testing and trend analysis', desc: 'Integrate mutation testing (Stryker/PITest) to validate test quality beyond line coverage.', effort: '2–4 weeks', tags: ['Advanced', 'Quality'] },
  ],
  integration: [
    { maxScore: 1, title: 'Write integration tests for critical API paths', desc: 'Identify top 5 critical service interactions and write automated tests.', effort: '1–2 weeks', tags: ['Foundation', 'API'] },
    { maxScore: 2, title: 'Implement contract testing with Pact', desc: 'Set up Pact consumer tests. Publish contracts to a Pact Broker.', effort: '2–3 weeks', tags: ['Contract Testing', 'Pact'] },
    { maxScore: 3, title: 'Add provider verification and can-i-deploy', desc: 'Configure provider-side verification in CI. Use can-i-deploy before promotions.', effort: '1–2 weeks', tags: ['Contract Testing', 'Safety'] },
    { maxScore: 4, title: 'Enable ephemeral test environments per PR', desc: 'Use Kubernetes namespaces to spin up isolated environments per PR.', effort: '1–2 months', tags: ['Advanced', 'Infrastructure'] },
  ],
  functional: [
    { maxScore: 1, title: 'Automate top 10 critical user journeys', desc: 'Identify most important E2E flows and automate with Playwright/Cypress.', effort: '2–4 weeks', tags: ['Automation', 'E2E'] },
    { maxScore: 2, title: 'Set up test management in qTest', desc: 'Migrate test cases to qTest. Link to Jira requirements.', effort: '2–3 weeks', tags: ['Process', 'Traceability'] },
    { maxScore: 3, title: 'Achieve full traceability chain', desc: 'Ensure every requirement has linked tests and every failure generates a tracked defect.', effort: '1 sprint', tags: ['Quality', 'Process'] },
    { maxScore: 4, title: 'Automate CI → qTest result sync', desc: 'Push CI results automatically to qTest. Real-time dashboards.', effort: '2–4 weeks', tags: ['Integration', 'Reporting'] },
  ],
  automation: [
    { maxScore: 1, title: 'Set up a test automation framework', desc: 'Choose framework, establish POM and shared helpers.', effort: '1–2 weeks', tags: ['Foundation', 'Framework'] },
    { maxScore: 2, title: 'Automate 50% of regression tests', desc: 'Focus on stable, high-value tests first.', effort: '1–2 months', tags: ['Automation', 'Regression'] },
    { maxScore: 3, title: 'Integrate automation across CI + CD + CT', desc: 'Unit/contract in CI, smoke in CD (Tekton), regression in CT.', effort: '2–4 weeks', tags: ['Pipeline', 'Integration'] },
    { maxScore: 4, title: 'Add self-healing and AI-optimised execution', desc: 'Smart selectors, deduplication, optimal execution ordering.', effort: '2–3 months', tags: ['Advanced', 'AI'] },
  ],
  performance: [
    { maxScore: 1, title: 'Run a baseline performance test', desc: 'Use k6/Gatling to establish baseline response times for critical APIs.', effort: '1 week', tags: ['Foundation', 'Baseline'] },
    { maxScore: 2, title: 'Integrate SAST + dependency scanning in CI', desc: 'Add SonarQube security rules + Snyk/OWASP to CI.', effort: '1–2 days', tags: ['Security', 'Quick Win'] },
    { maxScore: 3, title: 'Automate performance regression detection', desc: 'Set performance budgets. Fail CI if response times regress.', effort: '2–3 weeks', tags: ['Performance', 'CI/CD'] },
    { maxScore: 4, title: 'Add DAST + container scanning', desc: 'Integrate ZAP DAST and container image scanning.', effort: '2–4 weeks', tags: ['Security', 'Advanced'] },
  ],
  environments: [
    { maxScore: 1, title: 'Provision dedicated TEST and UAT environments', desc: 'Create separate environments per stage. Document configuration.', effort: '1–2 weeks', tags: ['Infrastructure', 'Foundation'] },
    { maxScore: 2, title: 'Adopt Infrastructure-as-Code', desc: 'Manage all test environments via Terraform/Ansible.', effort: '2–4 weeks', tags: ['IaC', 'Automation'] },
    { maxScore: 3, title: 'Implement synthetic test data generators', desc: 'Replace prod copies with deterministic, synthetic test data.', effort: '2–4 weeks', tags: ['Test Data', 'Quality'] },
    { maxScore: 4, title: 'Enable on-demand ephemeral environments', desc: 'Self-service creation via K8s namespaces with auto teardown.', effort: '1–2 months', tags: ['Advanced', 'Self-Service'] },
  ],
  reporting: [
    { maxScore: 1, title: 'Set up Allure reporting', desc: 'Integrate Allure into CI. Publish as pipeline artifact.', effort: '1–2 days', tags: ['Reporting', 'Quick Win'] },
    { maxScore: 2, title: 'Track defect metrics and escape rate', desc: 'Define and measure: defect density, escape rate, MTTD, root cause.', effort: '1–2 weeks', tags: ['Metrics', 'Process'] },
    { maxScore: 3, title: 'Build a centralised quality dashboard', desc: 'Aggregate CI + SonarQube + qTest + ServiceNow data.', effort: '2–4 weeks', tags: ['Dashboard', 'Integration'] },
    { maxScore: 4, title: 'Add predictive quality analytics', desc: 'Use historical data to predict defect-prone areas.', effort: '2–3 months', tags: ['Advanced', 'AI'] },
  ],
  observability: [
    { maxScore: 1, title: 'Deploy APM and health monitoring', desc: 'Set up Dynatrace/Datadog for production metrics and alerting.', effort: '1–2 weeks', tags: ['Monitoring', 'Foundation'] },
    { maxScore: 2, title: 'Implement full observability stack', desc: 'Correlate metrics + logs + traces. Service health dashboards.', effort: '2–4 weeks', tags: ['Observability', 'Infrastructure'] },
    { maxScore: 3, title: 'Create production → test feedback loop', desc: 'Use prod error patterns to generate new regression tests.', effort: '1–2 months', tags: ['Feedback Loop', 'Advanced'] },
    { maxScore: 4, title: 'Implement canary + auto-rollback', desc: 'Canary analysis with automatic rollback on anomaly detection.', effort: '2–3 months', tags: ['Canary', 'Resilience'] },
  ],
};
