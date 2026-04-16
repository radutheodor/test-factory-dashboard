// ════════════════════════════════════════════════════════════════
// MATURITY CONFIGURATION
// ════════════════════════════════════════════════════════════════
// This file is the single source of truth for:
//   - Dimensions and their weights
//   - Questions per dimension
//   - Maturity level thresholds
//   - Scoring formula
//
// To customize: edit the weights, questions, or thresholds below.
// All weights must sum to 100.
// ════════════════════════════════════════════════════════════════

import {
  DimensionConfig,
  MaturityQuestion,
  MaturityLevelConfig,
} from '../models/maturity.model';

// ── DIMENSION DEFINITIONS & WEIGHTS ─────────────────────────
export const DIMENSIONS: DimensionConfig[] = [
  { id: 'strategy',       name: 'Test Strategy & Planning',          weight: 10, icon: 'assignment',        color: '#002C4B' },
  { id: 'unit',           name: 'Unit Testing',                      weight: 15, icon: 'code',              color: '#33566F' },
  { id: 'integration',    name: 'Integration & Contract Testing',    weight: 15, icon: 'sync_alt',          color: '#5A8BA5' },
  { id: 'functional',     name: 'Functional & System Testing',       weight: 12, icon: 'checklist',         color: '#8E654C' },
  { id: 'automation',     name: 'Test Automation',                   weight: 13, icon: 'smart_toy',         color: '#B8956F' },
  { id: 'performance',    name: 'Performance & Non-Functional',      weight: 10, icon: 'speed',             color: '#960021' },
  { id: 'environments',   name: 'Test Environments & Data',          weight: 8,  icon: 'dns',               color: '#92847A' },
  { id: 'reporting',      name: 'Test Reporting & Metrics',          weight: 9,  icon: 'assessment',        color: '#CCC2BB' },
  { id: 'observability',  name: 'Monitoring & Observability',        weight: 8,  icon: 'monitoring',        color: '#6B4C3B' },
];

// ── MATURITY LEVEL THRESHOLDS ───────────────────────────────
// Overall weighted score is 0–5. Thresholds determine the level.
export const MATURITY_LEVELS: MaturityLevelConfig[] = [
  { level: 'Initial',                  minScore: 0,   maxScore: 1.0, color: '#DC2626', description: 'Ad-hoc processes, no formal testing strategy. Testing is reactive and inconsistent.' },
  { level: 'Managed',                  minScore: 1.0, maxScore: 2.0, color: '#F59E0B', description: 'Basic processes exist. Some testing is planned but not standardized across teams.' },
  { level: 'Defined',                  minScore: 2.0, maxScore: 3.0, color: '#3B82F6', description: 'Standardized processes. Testing is integrated into the SDLC with clear roles and responsibilities.' },
  { level: 'Quantitatively Managed',   minScore: 3.0, maxScore: 4.0, color: '#10B981', description: 'Metrics-driven. Testing effectiveness is measured, analysed, and continuously improved.' },
  { level: 'Optimizing',               minScore: 4.0, maxScore: 5.0, color: '#8B5CF6', description: 'Continuous optimization. AI-assisted, self-healing tests, production feedback loops.' },
];

// ── QUESTIONS PER DIMENSION ─────────────────────────────────
export const QUESTIONS: MaturityQuestion[] = [

  // ─── Test Strategy & Planning ───
  {
    id: 'strategy-1', dimension: 'strategy',
    text: 'Does a formal test strategy and test plan exist for the product?',
    explanation: 'A formal test strategy defines the overall approach, scope, risk areas, and types of testing. A test plan details what will be tested, by whom, and when.',
    options: [
      { label: 'No strategy or plan exists', score: 0 },
      { label: 'Informal / tribal knowledge only', score: 1 },
      { label: 'Documented but not maintained', score: 2 },
      { label: 'Documented, maintained, covers all test types', score: 3 },
      { label: 'Strategy aligned with risk, reviewed quarterly', score: 4 },
      { label: 'Living document, continuously optimised with data', score: 5 },
    ]
  },
  {
    id: 'strategy-2', dimension: 'strategy',
    text: 'Are test activities integrated into the Definition of Done?',
    explanation: 'The Definition of Done should include quality gates such as unit test coverage, code review, and passing CI checks.',
    options: [
      { label: 'No Definition of Done exists', score: 0 },
      { label: 'DoD exists but does not mention testing', score: 1 },
      { label: 'DoD mentions testing informally', score: 2 },
      { label: 'DoD includes specific test criteria', score: 3 },
      { label: 'DoD enforced via CI/CD gates', score: 4 },
      { label: 'DoD continuously refined based on defect analysis', score: 5 },
    ]
  },
  {
    id: 'strategy-3', dimension: 'strategy',
    text: 'Is there a risk-based approach to test prioritisation?',
    explanation: 'Risk-based testing focuses effort on areas most likely to fail or cause the highest business impact.',
    options: [
      { label: 'No risk assessment for testing', score: 0 },
      { label: 'Ad-hoc risk considerations', score: 1 },
      { label: 'Basic risk matrix exists', score: 2 },
      { label: 'Risk-based prioritisation drives test selection', score: 3 },
      { label: 'Risk models updated with each release', score: 4 },
      { label: 'Automated risk scoring based on code changes + production data', score: 5 },
    ]
  },

  // ─── Unit Testing ───
  {
    id: 'unit-1', dimension: 'unit',
    text: 'Do unit tests exist for the codebase?',
    explanation: 'Unit tests verify individual functions/methods in isolation. They are the fastest and cheapest form of automated testing.',
    options: [
      { label: 'No unit tests', score: 0 },
      { label: 'Some unit tests exist (<20% coverage)', score: 1 },
      { label: 'Unit tests exist (20-40% coverage)', score: 2 },
      { label: 'Good coverage (40-60%)', score: 3 },
      { label: 'Strong coverage (60-80%)', score: 4 },
      { label: 'Comprehensive coverage (>80%) with mutation testing', score: 5 },
    ]
  },
  {
    id: 'unit-2', dimension: 'unit',
    text: 'Are unit tests integrated into the CI pipeline?',
    explanation: 'Unit tests should run automatically on every commit and PR to provide fast feedback.',
    options: [
      { label: 'No CI pipeline or unit tests not in CI', score: 0 },
      { label: 'Unit tests run manually before merge', score: 1 },
      { label: 'Unit tests run in CI but not blocking', score: 2 },
      { label: 'Unit tests run in CI and block merge on failure', score: 3 },
      { label: 'CI includes coverage gating (minimum threshold)', score: 4 },
      { label: 'CI includes coverage gating + trend analysis + flaky test detection', score: 5 },
    ]
  },
  {
    id: 'unit-3', dimension: 'unit',
    text: 'Is code coverage measured and tracked over time?',
    explanation: 'Code coverage metrics (line, branch, mutation) should be tracked to prevent erosion and guide testing efforts.',
    options: [
      { label: 'No coverage measurement', score: 0 },
      { label: 'Coverage measured locally by developers', score: 1 },
      { label: 'Coverage reported in CI but not tracked', score: 2 },
      { label: 'Coverage tracked in SonarQube with historical trends', score: 3 },
      { label: 'Coverage gated in CI + trends visible on dashboard', score: 4 },
      { label: 'Coverage + mutation testing + dead code analysis', score: 5 },
    ]
  },

  // ─── Integration & Contract Testing ───
  {
    id: 'integration-1', dimension: 'integration',
    text: 'Are integration tests implemented for service interactions?',
    explanation: 'Integration tests verify that multiple components work together correctly, including API calls, database interactions, and message queues.',
    options: [
      { label: 'No integration tests', score: 0 },
      { label: 'Ad-hoc integration testing (manual)', score: 1 },
      { label: 'Some automated integration tests for critical paths', score: 2 },
      { label: 'Automated integration tests for most service interactions', score: 3 },
      { label: 'Comprehensive suite covering all API endpoints + error paths', score: 4 },
      { label: 'Full suite with contract testing, chaos engineering, and fault injection', score: 5 },
    ]
  },
  {
    id: 'integration-2', dimension: 'integration',
    text: 'Are contract tests implemented for API boundaries?',
    explanation: 'Contract testing (e.g., Pact) verifies that service consumers and providers agree on API contracts, preventing integration failures.',
    options: [
      { label: 'No contract testing', score: 0 },
      { label: 'API documentation exists but not verified', score: 1 },
      { label: 'OpenAPI/Swagger specs maintained', score: 2 },
      { label: 'Pact consumer tests implemented', score: 3 },
      { label: 'Full consumer + provider verification via Pact Broker', score: 4 },
      { label: 'Contract tests + can-i-deploy checks in CI/CD pipeline', score: 5 },
    ]
  },
  {
    id: 'integration-3', dimension: 'integration',
    text: 'Are integration tests executed in a realistic environment?',
    explanation: 'Integration tests should run against real (or near-real) dependencies like databases, message brokers, and partner services.',
    options: [
      { label: 'No dedicated test environment', score: 0 },
      { label: 'Tests run against mocks only', score: 1 },
      { label: 'Tests run in CI with containerised dependencies (Testcontainers)', score: 2 },
      { label: 'Tests run in a shared DEV/TEST environment', score: 3 },
      { label: 'Tests run in dedicated namespace with real infrastructure (OpenShift, Kafka)', score: 4 },
      { label: 'Tests run in ephemeral environments spun up per PR', score: 5 },
    ]
  },

  // ─── Functional & System Testing ───
  {
    id: 'functional-1', dimension: 'functional',
    text: 'Are functional/system tests executed for the product?',
    explanation: 'System tests verify end-to-end workflows spanning multiple applications, simulating real user scenarios.',
    options: [
      { label: 'No system tests', score: 0 },
      { label: 'Manual system testing only', score: 1 },
      { label: 'Some automated E2E tests for critical flows', score: 2 },
      { label: 'Automated regression suite covering major user journeys', score: 3 },
      { label: 'Comprehensive E2E suite with data-driven scenarios', score: 4 },
      { label: 'AI-augmented test generation + visual regression + accessibility', score: 5 },
    ]
  },
  {
    id: 'functional-2', dimension: 'functional',
    text: 'Are test cases managed in a test management tool (e.g., qTest)?',
    explanation: 'Test management tools provide traceability from requirements to test cases to execution results.',
    options: [
      { label: 'No test management tool', score: 0 },
      { label: 'Test cases in spreadsheets or wiki', score: 1 },
      { label: 'Tool exists but partially used', score: 2 },
      { label: 'All test cases in qTest, linked to Jira stories', score: 3 },
      { label: 'Full traceability: requirement → test case → execution → defect', score: 4 },
      { label: 'Automated sync between CI results and qTest + real-time dashboards', score: 5 },
    ]
  },

  // ─── Test Automation ───
  {
    id: 'automation-1', dimension: 'automation',
    text: 'What is the overall level of test automation?',
    explanation: 'Test automation maturity spans from no automation to fully self-healing, AI-optimised test suites.',
    options: [
      { label: 'No test automation', score: 0 },
      { label: '<25% of regression tests automated', score: 1 },
      { label: '25-50% automated', score: 2 },
      { label: '50-75% automated with stable suite', score: 3 },
      { label: '>75% automated, integrated in CI/CD, minimal flakiness', score: 4 },
      { label: '>90% automated, self-healing, AI-optimised deduplication', score: 5 },
    ]
  },
  {
    id: 'automation-2', dimension: 'automation',
    text: 'Are automated tests maintainable and following best practices?',
    explanation: 'Sustainable automation requires page object patterns, reusable fixtures, proper assertions, and low flakiness.',
    options: [
      { label: 'No automation framework', score: 0 },
      { label: 'Scripts exist but fragile and unmaintained', score: 1 },
      { label: 'Basic framework with some reuse', score: 2 },
      { label: 'Well-structured framework (POM, fixtures, helpers)', score: 3 },
      { label: 'Framework with retry logic, parallel execution, reporting', score: 4 },
      { label: 'Self-healing selectors, AI deduplication, optimal execution order', score: 5 },
    ]
  },
  {
    id: 'automation-3', dimension: 'automation',
    text: 'Is test automation integrated across the full pipeline (CI → CD → CT)?',
    explanation: 'Automation should span from unit tests in CI to smoke tests in CD to regression suites in CT.',
    options: [
      { label: 'No pipeline integration', score: 0 },
      { label: 'Automated tests in CI only', score: 1 },
      { label: 'CI + some post-deployment checks', score: 2 },
      { label: 'CI + CD smoke tests (Tekton)', score: 3 },
      { label: 'CI + CD + CT automated regression in TEST/UAT', score: 4 },
      { label: 'Full CI + CD + CT + production synthetic monitoring', score: 5 },
    ]
  },

  // ─── Performance & Non-Functional ───
  {
    id: 'performance-1', dimension: 'performance',
    text: 'Are performance tests executed regularly?',
    explanation: 'Performance testing includes load, stress, endurance, and spike tests to validate system capacity.',
    options: [
      { label: 'No performance testing', score: 0 },
      { label: 'Ad-hoc manual performance checks', score: 1 },
      { label: 'Performance tests run before major releases', score: 2 },
      { label: 'Regular performance test suite (k6, Gatling, JMeter)', score: 3 },
      { label: 'Automated performance regression in CI/CD', score: 4 },
      { label: 'Continuous performance monitoring + automated anomaly detection', score: 5 },
    ]
  },
  {
    id: 'performance-2', dimension: 'performance',
    text: 'Is security testing integrated into the development process?',
    explanation: 'Security testing includes SAST, DAST, dependency scanning, and penetration testing.',
    options: [
      { label: 'No security testing', score: 0 },
      { label: 'Annual penetration test only', score: 1 },
      { label: 'SAST tool integrated (SonarQube security rules)', score: 2 },
      { label: 'SAST + dependency scanning (Snyk/OWASP) in CI', score: 3 },
      { label: 'SAST + DAST + container scanning in pipeline', score: 4 },
      { label: 'Full DevSecOps: SAST + DAST + IAST + runtime protection', score: 5 },
    ]
  },

  // ─── Test Environments & Data ───
  {
    id: 'environments-1', dimension: 'environments',
    text: 'How are test environments managed?',
    explanation: 'Test environments should be consistent, reproducible, and available on demand.',
    options: [
      { label: 'No dedicated test environments', score: 0 },
      { label: 'Shared environments, manually configured', score: 1 },
      { label: 'Dedicated environments per stage (DEV, TEST, UAT)', score: 2 },
      { label: 'Infrastructure-as-Code managed environments', score: 3 },
      { label: 'On-demand ephemeral environments (Kubernetes namespaces)', score: 4 },
      { label: 'Self-service, ephemeral, production-parity environments', score: 5 },
    ]
  },
  {
    id: 'environments-2', dimension: 'environments',
    text: 'How is test data managed?',
    explanation: 'Test data management includes synthetic data generation, data masking, and state management.',
    options: [
      { label: 'No test data strategy', score: 0 },
      { label: 'Copy of production data (unmasked)', score: 1 },
      { label: 'Masked production data subsets', score: 2 },
      { label: 'Synthetic test data generators', score: 3 },
      { label: 'Data factories with API-driven setup/teardown', score: 4 },
      { label: 'Full test data management platform with versioning', score: 5 },
    ]
  },

  // ─── Test Reporting & Metrics ───
  {
    id: 'reporting-1', dimension: 'reporting',
    text: 'Is there a quality dashboard with key test metrics?',
    explanation: 'A quality dashboard provides real-time visibility into test results, coverage, defect trends, and release readiness.',
    options: [
      { label: 'No dashboard or reporting', score: 0 },
      { label: 'Manual reports (email, spreadsheet)', score: 1 },
      { label: 'Basic CI reports (JUnit XML)', score: 2 },
      { label: 'Allure or similar reporting with historical trends', score: 3 },
      { label: 'Centralised dashboard aggregating CI + qTest + Sonar', score: 4 },
      { label: 'Real-time quality intelligence platform with predictive analytics', score: 5 },
    ]
  },
  {
    id: 'reporting-2', dimension: 'reporting',
    text: 'Are defect metrics tracked and used for process improvement?',
    explanation: 'Defect metrics include escape rate, mean time to detect, defect density, and root cause analysis.',
    options: [
      { label: 'No defect tracking', score: 0 },
      { label: 'Defects logged in Jira but not analysed', score: 1 },
      { label: 'Basic defect reports (count, severity)', score: 2 },
      { label: 'Defect trends, escape rate, and root cause analysis', score: 3 },
      { label: 'Defect prediction models + automated categorisation', score: 4 },
      { label: 'ML-based defect prediction influencing test prioritisation', score: 5 },
    ]
  },

  // ─── Monitoring & Observability ───
  {
    id: 'observability-1', dimension: 'observability',
    text: 'Is production monitoring used as a feedback loop for testing?',
    explanation: 'Production observability (logs, metrics, traces) should inform test strategy and catch gaps.',
    options: [
      { label: 'No production monitoring', score: 0 },
      { label: 'Basic uptime monitoring (Pingdom, Healthcheck)', score: 1 },
      { label: 'APM tool deployed (Dynatrace, Datadog, Grafana)', score: 2 },
      { label: 'Full observability: metrics + logs + traces correlated', score: 3 },
      { label: 'Production insights feed back into test case generation', score: 4 },
      { label: 'Automated canary analysis + chaos engineering in production', score: 5 },
    ]
  },
  {
    id: 'observability-2', dimension: 'observability',
    text: 'Are synthetic monitoring / smoke tests running in production?',
    explanation: 'Synthetic monitoring runs automated checks against production to detect issues before users do.',
    options: [
      { label: 'No synthetic monitoring', score: 0 },
      { label: 'Manual spot checks only', score: 1 },
      { label: 'Health check endpoints monitored', score: 2 },
      { label: 'Automated smoke tests running on schedule', score: 3 },
      { label: 'Synthetic user journeys with alerting', score: 4 },
      { label: 'Full synthetic monitoring + canary deployments + auto-rollback', score: 5 },
    ]
  },
];

// ── SCORING FORMULA ─────────────────────────────────────────
// The overall score is computed as:
//   overallScore = Σ (dimensionAvg * dimensionWeight / 100)
//
// Where:
//   dimensionAvg = sum of question scores / number of questions (0–5)
//   dimensionWeight = weight from DIMENSIONS config (sums to 100)
//   overallScore is on a 0–5 scale
//
// To change the formula, edit the calculateOverallScore function
// in maturity.service.ts.
