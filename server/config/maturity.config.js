// ════════════════════════════════════════════════════════════════
// Maturity Framework Configuration
// ════════════════════════════════════════════════════════════════
// 4 dimensions (25% each), binary checkbox questions.
// - Backend: require()
// - Frontend: GET /api/maturity-config
// ════════════════════════════════════════════════════════════════

const DIMENSIONS = [
  { id: 'testing',       name: 'Testing',       weight: 25, icon: 'bug_report',    color: '#002C4B' },
  { id: 'performance',   name: 'Performance',   weight: 25, icon: 'speed',         color: '#960021' },
  { id: 'observability', name: 'Observability', weight: 25, icon: 'monitoring',    color: '#4A6741' },
  { id: 'production',    name: 'Production',    weight: 25, icon: 'rocket_launch', color: '#8E654C' },
];

const MATURITY_LEVELS = [
  { level: 'Initial',                minScore: 0,    maxScore: 1.0,  color: '#DC2626', desc: 'Ad-hoc processes, no formal testing strategy. Testing is reactive and inconsistent.' },
  { level: 'Managed',                minScore: 1.0,  maxScore: 2.0,  color: '#F59E0B', desc: 'Basic processes exist. Some testing is planned but not standardised across the team.' },
  { level: 'Defined',                minScore: 2.0,  maxScore: 3.0,  color: '#3B82F6', desc: 'Standardised processes. Testing is integrated into the SDLC with clear ownership.' },
  { level: 'Quantitatively Managed', minScore: 3.0,  maxScore: 4.0,  color: '#10B981', desc: 'Metrics-driven. Testing effectiveness is measured, analysed, and continuously improved.' },
  { level: 'Optimizing',             minScore: 4.0,  maxScore: 5.01, color: '#8B5CF6', desc: 'Continuous optimisation. AI-assisted testing, production feedback loops, self-healing suites.' },
];

// ── QUESTIONS (binary checkboxes — checked = practice in place) ──
const QUESTIONS = [
  // ── Testing (includes security) ──
  { id: 't1',  dim: 'testing',       text: 'A formal test strategy document exists and is actively maintained' },
  { id: 't2',  dim: 'testing',       text: 'Testing is integrated into the Definition of Done' },
  { id: 't3',  dim: 'testing',       text: 'Risk-based test prioritisation is applied when selecting tests' },
  { id: 't4',  dim: 'testing',       text: 'Unit tests exist with ≥ 40% code coverage' },
  { id: 't5',  dim: 'testing',       text: 'Unit tests run in CI and block merge on failure' },
  { id: 't6',  dim: 'testing',       text: 'Code coverage is tracked and gated in CI (e.g. SonarQube)' },
  { id: 't7',  dim: 'testing',       text: 'Integration tests exist for critical service interactions' },
  { id: 't8',  dim: 'testing',       text: 'Contract tests (e.g. Pact) are implemented for API boundaries' },
  { id: 't9',  dim: 'testing',       text: 'Functional / E2E tests are automated for critical user journeys' },
  { id: 't10', dim: 'testing',       text: 'Test cases are managed in a test management tool (e.g. qTest), linked to requirements' },
  { id: 't11', dim: 'testing',       text: 'Automated tests cover ≥ 50% of the regression scope' },
  { id: 't12', dim: 'testing',       text: 'Security scanning (SAST + dependency checks) is integrated in CI' },
  // ── Performance ──
  { id: 'p1',  dim: 'performance',   text: 'Baseline performance tests have been established (k6, Gatling, JMeter)' },
  { id: 'p2',  dim: 'performance',   text: 'Performance tests run regularly (load, stress, endurance)' },
  { id: 'p3',  dim: 'performance',   text: 'Performance regression is automatically detected and gated in CI/CD' },
  { id: 'p4',  dim: 'performance',   text: 'Dynamic application security testing (DAST) is integrated in the pipeline' },
  { id: 'p5',  dim: 'performance',   text: 'Container / image scanning is in place' },
  // ── Observability ──
  { id: 'o1',  dim: 'observability', text: 'APM / production monitoring is deployed (Dynatrace, Datadog, Grafana, etc.)' },
  { id: 'o2',  dim: 'observability', text: 'Full observability stack is in place: metrics, logs, and traces correlated' },
  { id: 'o3',  dim: 'observability', text: 'A quality dashboard with key metrics exists (test results, coverage, defects)' },
  { id: 'o4',  dim: 'observability', text: 'Defect metrics (escape rate, MTTD, root cause) are tracked and reviewed regularly' },
  { id: 'o5',  dim: 'observability', text: 'Synthetic monitoring / smoke tests run continuously in production' },
  { id: 'o6',  dim: 'observability', text: 'Production error patterns are used to inform and generate new test cases' },
  // ── Production ──
  { id: 'r1',  dim: 'production',    text: 'Dedicated TEST and UAT environments exist and are consistently available' },
  { id: 'r2',  dim: 'production',    text: 'Environments are managed as Infrastructure-as-Code (Terraform, Ansible, etc.)' },
  { id: 'r3',  dim: 'production',    text: 'On-demand / ephemeral environments are available per branch or PR' },
  { id: 'r4',  dim: 'production',    text: 'Synthetic test data generators are in place — no unmasked production data is used' },
  { id: 'r5',  dim: 'production',    text: 'A full CI → CD → CT pipeline integration exists (build, deploy, test in sequence)' },
  { id: 'r6',  dim: 'production',    text: 'Test results sync automatically to the test management tool (e.g. qTest)' },
];

module.exports = { DIMENSIONS, MATURITY_LEVELS, QUESTIONS };
