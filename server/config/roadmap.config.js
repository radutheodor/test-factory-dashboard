// ════════════════════════════════════════════════════════════════
// Roadmap Configuration — Four Progressive Phases
// ════════════════════════════════════════════════════════════════
// Each phase contains actions with:
//   dim    — dimension id (testing | performance | observability | production)
//   title  — short action title
//   desc   — implementation guidance
//   tags   — additional labels shown alongside the dimension tag
// - Backend: require()
// - Frontend: GET /api/roadmap-config → { phases }
// ════════════════════════════════════════════════════════════════

const ROADMAP_PHASES = [
  // ────────────────────────────────────────────────────────────
  // Phase I — Delivery Path to Production
  // ────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Phase I — Delivery Path to Production',
    timeline: '3–6 months',
    color: '#002C4B',
    actions: [
      {
        dim: 'testing',
        title: 'Write a formal test strategy',
        desc: 'Define the testing approach, scope, tools, environments, and coverage targets. Align with the product architecture and SDLC.',
        tags: ['Foundation', 'Documentation'],
      },
      {
        dim: 'testing',
        title: 'Integrate testing into the Definition of Done',
        desc: 'Add explicit test criteria (unit tests pass, code reviewed, CI green) to the team DoD and enforce in sprint reviews.',
        tags: ['Process', 'Quick Win'],
      },
      {
        dim: 'testing',
        title: 'Establish unit testing with CI gating',
        desc: 'Set up a test framework (JUnit / Jest / pytest), target ≥ 40% coverage, run tests on every PR and block merge on failure.',
        tags: ['Unit Testing', 'CI/CD'],
      },
      {
        dim: 'testing',
        title: 'Automate integration tests for critical paths',
        desc: 'Identify and automate tests for your top 5 most critical service interactions, covering happy path and key error cases.',
        tags: ['Integration', 'API'],
      },
      {
        dim: 'testing',
        title: 'Migrate test cases to a test management tool',
        desc: 'Move test cases from spreadsheets / wikis to qTest (or equivalent). Link cases to Jira requirements for traceability.',
        tags: ['Test Management', 'Process'],
      },
      {
        dim: 'performance',
        title: 'Establish baseline performance tests',
        desc: 'Use k6 or Gatling to measure baseline response times and throughput for critical APIs. Document the baseline for future regression comparison.',
        tags: ['Baseline', 'Foundation'],
      },
      {
        dim: 'observability',
        title: 'Deploy APM and basic health monitoring',
        desc: 'Set up Dynatrace, Datadog, or Grafana for production metrics, log aggregation, and basic alerting on errors and latency.',
        tags: ['Monitoring', 'Foundation'],
      },
      {
        dim: 'production',
        title: 'Provision dedicated TEST and UAT environments',
        desc: 'Ensure separate, consistently available environments for each pipeline stage. Document access, reset procedures, and configuration.',
        tags: ['Environments', 'Foundation'],
      },
      {
        dim: 'production',
        title: 'Implement full CI → CD → CT pipeline integration',
        desc: 'Wire unit / contract tests in CI, smoke and health checks in CD (post-deploy), and regression suites in CT (TEST / UAT).',
        tags: ['CI/CD', 'Pipeline'],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Phase II — Full Automation
  // ────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Phase II — Full Automation',
    timeline: '6–12 months',
    color: '#33566F',
    actions: [
      {
        dim: 'testing',
        title: 'Gate code coverage in CI (SonarQube)',
        desc: 'Configure a SonarQube quality gate with a minimum coverage threshold (start at 40%, increase quarterly). Block merges that regress below it.',
        tags: ['Coverage', 'CI/CD'],
      },
      {
        dim: 'testing',
        title: 'Implement contract testing with Pact',
        desc: 'Set up Pact consumer tests for your API consumers. Publish contracts to a Pact Broker and verify on the provider side in CI.',
        tags: ['Contract Testing', 'API'],
      },
      {
        dim: 'testing',
        title: 'Automate ≥ 50% of the regression scope',
        desc: 'Build and stabilise an automated regression suite (Playwright, RestAssured, etc.) covering critical user journeys and API flows.',
        tags: ['Automation', 'Regression'],
      },
      {
        dim: 'testing',
        title: 'Automate E2E tests for critical user journeys',
        desc: 'Identify the top 10 most important end-to-end flows and automate them using Playwright or Cypress with the Page Object pattern.',
        tags: ['E2E', 'Automation'],
      },
      {
        dim: 'testing',
        title: 'Integrate SAST and dependency scanning in CI',
        desc: 'Add SonarQube security rules plus Snyk or OWASP Dependency Check to the CI pipeline. Fail builds on critical vulnerabilities.',
        tags: ['Security', 'CI/CD'],
      },
      {
        dim: 'performance',
        title: 'Run performance tests regularly',
        desc: 'Schedule regular load, stress, and endurance tests. Automate suite execution on a nightly or per-release cadence.',
        tags: ['Load Testing', 'Automation'],
      },
      {
        dim: 'observability',
        title: 'Implement full observability stack',
        desc: 'Correlate metrics, logs, and traces across services. Create dashboards for service health, latency percentiles, and error budgets.',
        tags: ['Observability', 'Tracing'],
      },
      {
        dim: 'observability',
        title: 'Build a centralised quality dashboard',
        desc: 'Aggregate data from CI (test results), SonarQube (coverage / bugs), and qTest (execution trends) into a single quality view.',
        tags: ['Dashboard', 'Reporting'],
      },
      {
        dim: 'production',
        title: 'Adopt Infrastructure-as-Code for environments',
        desc: 'Manage all test environments via Terraform or Ansible. Enable reproducible, version-controlled provisioning.',
        tags: ['IaC', 'Environments'],
      },
      {
        dim: 'production',
        title: 'Replace production data with synthetic generators',
        desc: 'Implement deterministic test data factories. Stop using copies of production data in TEST / UAT to eliminate data privacy risk.',
        tags: ['Test Data', 'Security'],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Phase III — Risk Based Testing
  // ────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Phase III — Risk Based Testing',
    timeline: '12 months',
    color: '#8E654C',
    actions: [
      {
        dim: 'testing',
        title: 'Implement risk-based test prioritisation',
        desc: 'Create a risk matrix mapping business impact × likelihood of failure. Use it to drive test selection and regression prioritisation each release.',
        tags: ['Risk', 'Strategy'],
      },
      {
        dim: 'testing',
        title: 'Enable Pact can-i-deploy in the CD pipeline',
        desc: 'Use can-i-deploy before every promotion to TEST or UAT to ensure no consumer-provider contract is broken.',
        tags: ['Contract Testing', 'Safety'],
      },
      {
        dim: 'testing',
        title: 'Achieve full requirement → test → defect traceability',
        desc: 'Ensure every requirement has linked test cases in qTest and every test failure creates a tracked Jira defect with root cause analysis.',
        tags: ['Traceability', 'Quality'],
      },
      {
        dim: 'performance',
        title: 'Gate performance regression in CI/CD',
        desc: 'Define performance budgets (p95 latency, throughput). Automatically fail builds when response times regress beyond thresholds.',
        tags: ['Performance Budgets', 'CI/CD'],
      },
      {
        dim: 'performance',
        title: 'Integrate DAST and container scanning',
        desc: 'Add OWASP ZAP DAST scans and container image scanning (Trivy, Anchore) into the pipeline alongside existing SAST.',
        tags: ['Security', 'DAST'],
      },
      {
        dim: 'observability',
        title: 'Track defect metrics and escape rate',
        desc: 'Define and regularly review: defect density, escape rate, mean time to detect (MTTD), and root cause categories per team.',
        tags: ['Metrics', 'Defects'],
      },
      {
        dim: 'observability',
        title: 'Implement synthetic monitoring in production',
        desc: 'Deploy automated synthetic user journeys that run on a schedule and alert when critical flows fail in production.',
        tags: ['Synthetic Monitoring', 'Production'],
      },
      {
        dim: 'production',
        title: 'Enable on-demand ephemeral environments',
        desc: 'Provision isolated Kubernetes namespaces per PR or branch with real dependencies. Tear down automatically after merge.',
        tags: ['Ephemeral Envs', 'Kubernetes'],
      },
      {
        dim: 'production',
        title: 'Automate CI → qTest result sync',
        desc: 'Push CI and CD pipeline test results automatically into qTest. Generate real-time coverage and execution dashboards per release.',
        tags: ['Integration', 'Test Management'],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Phase IV — AI-driven
  // ────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Phase IV — AI-driven',
    timeline: '1–2 years',
    color: '#8B5CF6',
    actions: [
      {
        dim: 'testing',
        title: 'Add mutation testing and trend analysis',
        desc: 'Integrate mutation testing (Stryker, PITest) to validate test suite quality beyond line coverage. Track mutation scores over time.',
        tags: ['Mutation Testing', 'Quality'],
      },
      {
        dim: 'testing',
        title: 'Implement self-healing and AI-optimised test execution',
        desc: 'Use smart selectors, AI-based test deduplication, and optimal ordering to reduce suite runtime and eliminate flakiness.',
        tags: ['AI', 'Self-Healing'],
      },
      {
        dim: 'performance',
        title: 'Implement continuous performance monitoring with anomaly detection',
        desc: 'Move from scheduled performance tests to always-on monitoring with ML-based anomaly detection and automated incident alerting.',
        tags: ['AI', 'Continuous'],
      },
      {
        dim: 'observability',
        title: 'Create a production → test feedback loop',
        desc: 'Use production error patterns and user session data to automatically generate and prioritise new regression test cases.',
        tags: ['AI', 'Feedback Loop'],
      },
      {
        dim: 'observability',
        title: 'Add predictive quality analytics',
        desc: 'Use historical defect and coverage data to predict defect-prone areas per release and automatically adjust test allocation.',
        tags: ['ML', 'Predictive'],
      },
      {
        dim: 'production',
        title: 'Implement canary deployments with auto-rollback',
        desc: 'Deploy with canary analysis using automated performance and error rate thresholds. Roll back instantly when quality gates are breached.',
        tags: ['Canary', 'Resilience'],
      },
      {
        dim: 'production',
        title: 'Enable chaos engineering and full synthetic validation',
        desc: 'Combine synthetic user journeys, canary analysis, and chaos engineering to continuously validate production resilience and recoverability.',
        tags: ['Chaos Engineering', 'Resilience'],
      },
    ],
  },
];

module.exports = { ROADMAP_PHASES };
