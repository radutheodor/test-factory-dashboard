// ════════════════════════════════════════════════════════════════
// Roadmap Configuration — Four Progressive Phases
// ════════════════════════════════════════════════════════════════
// Each action has a `questionId` that maps 1:1 to a question in
// maturity.config.js. The frontend only renders an action when its
// corresponding question is NOT checked in the assessment (i.e. the
// practice is missing). Every action here has a question; not every
// question needs an action.
// - Backend: require()
// - Frontend: GET /api/roadmap-config → { phases }
// ════════════════════════════════════════════════════════════════

const ROADMAP_PHASES = [
  // ────────────────────────────────────────────────────────────
  // Phase I — Delivery Path to Production  (3–6 months)
  // ────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Phase I — Delivery Path to Production',
    timeline: '3–6 months',
    color: '#002C4B',
    actions: [
      {
        questionId: 't1',
        dim: 'testing',
        title: 'Write a formal test strategy',
        desc: 'Define the testing approach, scope, tools, environments, and coverage targets. Align with the product architecture and SDLC.',
        tags: ['Foundation', 'Documentation'],
      },
      {
        questionId: 't2',
        dim: 'testing',
        title: 'Integrate testing into the Definition of Done',
        desc: 'Add explicit test criteria (unit tests pass, code reviewed, CI green) to the team DoD and enforce in sprint reviews.',
        tags: ['Process', 'Quick Win'],
      },
      {
        questionId: 't4',
        dim: 'testing',
        title: 'Achieve ≥ 40% unit test code coverage',
        desc: 'Set up a test framework (JUnit / Jest / pytest) and write unit tests for all new and modified code. Track progress toward 40% as a first milestone.',
        tags: ['Unit Testing', 'Foundation'],
      },
      {
        questionId: 't5',
        dim: 'testing',
        title: 'Integrate unit tests into CI with merge blocking',
        desc: 'Configure your CI pipeline (Azure DevOps / GitHub Actions) to run unit tests on every PR. Fail and block merges when tests fail.',
        tags: ['Unit Testing', 'CI/CD'],
      },
      {
        questionId: 't7',
        dim: 'testing',
        title: 'Automate integration tests for critical service interactions',
        desc: 'Identify and automate tests for your top 5 most critical service interactions, covering happy path and key error cases.',
        tags: ['Integration', 'API'],
      },
      {
        questionId: 't10',
        dim: 'testing',
        title: 'Migrate test cases to a test management tool',
        desc: 'Move test cases from spreadsheets / wikis to qTest (or equivalent). Link cases to Jira requirements for traceability.',
        tags: ['Test Management', 'Process'],
      },
      {
        questionId: 'p1',
        dim: 'performance',
        title: 'Establish baseline performance tests',
        desc: 'Use k6 or Gatling to measure baseline response times and throughput for critical APIs. Document the baseline for future regression comparison.',
        tags: ['Baseline', 'Foundation'],
      },
      {
        questionId: 'o1',
        dim: 'observability',
        title: 'Deploy APM and basic health monitoring',
        desc: 'Set up Dynatrace, Datadog, or Grafana for production metrics, log aggregation, and basic alerting on errors and latency.',
        tags: ['Monitoring', 'Foundation'],
      },
      {
        questionId: 'r1',
        dim: 'production',
        title: 'Provision dedicated TEST and UAT environments',
        desc: 'Ensure separate, consistently available environments for each pipeline stage. Document access, reset procedures, and configuration.',
        tags: ['Environments', 'Foundation'],
      },
      {
        questionId: 'r5',
        dim: 'production',
        title: 'Implement full CI → CD → CT pipeline integration',
        desc: 'Wire unit / contract tests in CI, smoke and health checks in CD (post-deploy), and regression suites in CT (TEST / UAT).',
        tags: ['CI/CD', 'Pipeline'],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Phase II — Full Automation  (6–12 months)
  // ────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Phase II — Full Automation',
    timeline: '6–12 months',
    color: '#33566F',
    actions: [
      {
        questionId: 't6',
        dim: 'testing',
        title: 'Gate code coverage in CI (SonarQube)',
        desc: 'Configure a SonarQube quality gate with a minimum coverage threshold (start at 40%, increase quarterly). Block merges that regress below it.',
        tags: ['Coverage', 'CI/CD'],
      },
      {
        questionId: 't8',
        dim: 'testing',
        title: 'Implement contract testing with Pact',
        desc: 'Set up Pact consumer tests for your API consumers. Publish contracts to a Pact Broker and verify on the provider side in CI.',
        tags: ['Contract Testing', 'API'],
      },
      {
        questionId: 't9',
        dim: 'testing',
        title: 'Automate E2E tests for critical user journeys',
        desc: 'Identify the top 10 most important end-to-end flows and automate them using Playwright or Cypress with the Page Object pattern.',
        tags: ['E2E', 'Automation'],
      },
      {
        questionId: 't11',
        dim: 'testing',
        title: 'Automate ≥ 50% of the regression scope',
        desc: 'Build and stabilise an automated regression suite covering critical user journeys and API flows. Track automation progress weekly.',
        tags: ['Automation', 'Regression'],
      },
      {
        questionId: 't12',
        dim: 'testing',
        title: 'Integrate SAST and dependency scanning in CI',
        desc: 'Add SonarQube security rules plus Snyk or OWASP Dependency Check to the CI pipeline. Fail builds on critical vulnerabilities.',
        tags: ['Security', 'CI/CD'],
      },
      {
        questionId: 'p2',
        dim: 'performance',
        title: 'Run performance tests regularly',
        desc: 'Schedule regular load, stress, and endurance tests. Automate suite execution on a nightly or per-release cadence.',
        tags: ['Load Testing', 'Automation'],
      },
      {
        questionId: 'o2',
        dim: 'observability',
        title: 'Implement full observability stack',
        desc: 'Correlate metrics, logs, and traces across services. Create dashboards for service health, latency percentiles, and error budgets.',
        tags: ['Observability', 'Tracing'],
      },
      {
        questionId: 'o3',
        dim: 'observability',
        title: 'Build a centralised quality dashboard',
        desc: 'Aggregate data from CI (test results), SonarQube (coverage / bugs), and qTest (execution trends) into a single quality view.',
        tags: ['Dashboard', 'Reporting'],
      },
      {
        questionId: 'r2',
        dim: 'production',
        title: 'Adopt Infrastructure-as-Code for environments',
        desc: 'Manage all test environments via Terraform or Ansible. Enable reproducible, version-controlled provisioning.',
        tags: ['IaC', 'Environments'],
      },
      {
        questionId: 'r4',
        dim: 'production',
        title: 'Replace production data with synthetic generators',
        desc: 'Implement deterministic test data factories. Stop using copies of production data in TEST / UAT to eliminate data privacy risk.',
        tags: ['Test Data', 'Security'],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Phase III — Risk Based Testing  (12 months)
  // ────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Phase III — Risk Based Testing',
    timeline: '12 months',
    color: '#8E654C',
    actions: [
      {
        questionId: 't3',
        dim: 'testing',
        title: 'Implement risk-based test prioritisation',
        desc: 'Create a risk matrix mapping business impact × likelihood of failure. Use it to drive test selection and regression prioritisation each release.',
        tags: ['Risk', 'Strategy'],
      },
      {
        questionId: 't13',
        dim: 'testing',
        title: 'Enable Pact can-i-deploy in the CD pipeline',
        desc: 'Use can-i-deploy before every promotion to TEST or UAT to ensure no consumer-provider contract is broken before the deployment proceeds.',
        tags: ['Contract Testing', 'Safety'],
      },
      {
        questionId: 'p3',
        dim: 'performance',
        title: 'Gate performance regression in CI/CD',
        desc: 'Define performance budgets (p95 latency, throughput). Automatically fail builds when response times regress beyond thresholds.',
        tags: ['Performance Budgets', 'CI/CD'],
      },
      {
        questionId: 'p4',
        dim: 'performance',
        title: 'Integrate DAST in the pipeline',
        desc: 'Add OWASP ZAP dynamic application security testing scans into the pipeline. Run against TEST environment on every release candidate.',
        tags: ['Security', 'DAST'],
      },
      {
        questionId: 'p5',
        dim: 'performance',
        title: 'Add container and image scanning',
        desc: 'Integrate container image scanning (Trivy, Anchore, or equivalent) into the CI pipeline alongside existing SAST and dependency checks.',
        tags: ['Security', 'Containers'],
      },
      {
        questionId: 'o4',
        dim: 'observability',
        title: 'Track defect metrics and escape rate',
        desc: 'Define and regularly review: defect density, escape rate, mean time to detect (MTTD), and root cause categories per team.',
        tags: ['Metrics', 'Defects'],
      },
      {
        questionId: 'o5',
        dim: 'observability',
        title: 'Implement synthetic monitoring in production',
        desc: 'Deploy automated synthetic user journeys that run on a schedule and alert when critical flows fail in production.',
        tags: ['Synthetic Monitoring', 'Production'],
      },
      {
        questionId: 'r3',
        dim: 'production',
        title: 'Enable on-demand ephemeral environments',
        desc: 'Provision isolated Kubernetes namespaces per PR or branch with real dependencies. Tear down automatically after merge.',
        tags: ['Ephemeral Envs', 'Kubernetes'],
      },
      {
        questionId: 'r6',
        dim: 'production',
        title: 'Automate CI → qTest result sync',
        desc: 'Push CI and CD pipeline test results automatically into qTest. Generate real-time coverage and execution dashboards per release.',
        tags: ['Integration', 'Test Management'],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // Phase IV — AI-driven  (1–2 years)
  // ────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Phase IV — AI-driven',
    timeline: '1–2 years',
    color: '#8B5CF6',
    actions: [
      {
        questionId: 't14',
        dim: 'testing',
        title: 'Add mutation testing and trend analysis',
        desc: 'Integrate mutation testing (Stryker, PITest) to validate test suite quality beyond line coverage. Track mutation scores over time.',
        tags: ['Mutation Testing', 'Quality'],
      },
      {
        questionId: 't15',
        dim: 'testing',
        title: 'Implement self-healing and AI-optimised test execution',
        desc: 'Use smart selectors, AI-based test deduplication, and optimal ordering to reduce suite runtime and eliminate flakiness.',
        tags: ['AI', 'Self-Healing'],
      },
      {
        questionId: 'p6',
        dim: 'performance',
        title: 'Implement continuous performance monitoring with anomaly detection',
        desc: 'Move from scheduled performance tests to always-on monitoring with ML-based anomaly detection and automated incident alerting.',
        tags: ['AI', 'Continuous'],
      },
      {
        questionId: 'o6',
        dim: 'observability',
        title: 'Create a production → test feedback loop',
        desc: 'Use production error patterns and user session data to automatically generate and prioritise new regression test cases.',
        tags: ['AI', 'Feedback Loop'],
      },
      {
        questionId: 'o7',
        dim: 'observability',
        title: 'Add predictive quality analytics',
        desc: 'Use historical defect and coverage data to predict defect-prone areas per release and automatically adjust test allocation.',
        tags: ['ML', 'Predictive'],
      },
      {
        questionId: 'r7',
        dim: 'production',
        title: 'Implement canary deployments with auto-rollback',
        desc: 'Deploy with canary analysis using automated performance and error rate thresholds. Roll back instantly when quality gates are breached.',
        tags: ['Canary', 'Resilience'],
      },
      {
        questionId: 'r8',
        dim: 'production',
        title: 'Enable chaos engineering and full synthetic validation',
        desc: 'Combine synthetic user journeys, canary analysis, and chaos engineering to continuously validate production resilience and recoverability.',
        tags: ['Chaos Engineering', 'Resilience'],
      },
    ],
  },
];

module.exports = { ROADMAP_PHASES };
