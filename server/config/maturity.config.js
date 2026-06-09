// ════════════════════════════════════════════════════════════════
// Maturity Framework Configuration
// ════════════════════════════════════════════════════════════════
// Dimensions (with weights), maturity levels, and questions.
// - Backend: require()
// - Frontend: GET /api/maturity-config
// ════════════════════════════════════════════════════════════════

const DIMENSIONS = [
  { id: 'strategy',     name: 'Test Strategy & Planning',       weight: 10, icon: 'assignment',    color: '#002C4B' },
  { id: 'unit',         name: 'Unit Testing',                   weight: 15, icon: 'code',          color: '#33566F' },
  { id: 'integration',  name: 'Integration & Contract Testing', weight: 15, icon: 'sync_alt',      color: '#5A8BA5' },
  { id: 'functional',   name: 'Functional & System Testing',    weight: 12, icon: 'checklist',     color: '#8E654C' },
  { id: 'automation',   name: 'Test Automation',                weight: 13, icon: 'smart_toy',     color: '#B8956F' },
  { id: 'performance',  name: 'Performance & Non-Functional',   weight: 10, icon: 'speed',         color: '#960021' },
  { id: 'environments', name: 'Test Environments & Data',       weight: 8,  icon: 'dns',           color: '#92847A' },
  { id: 'reporting',    name: 'Test Reporting & Metrics',       weight: 9,  icon: 'assessment',    color: '#6B4C3B' },
  { id: 'observability',name: 'Monitoring & Observability',     weight: 8,  icon: 'monitoring',    color: '#4A6741' },
];

const MATURITY_LEVELS = [
  { level: 'Initial',                minScore: 0,   maxScore: 1.0, color: '#DC2626', desc: 'Ad-hoc processes, no formal testing strategy. Testing is reactive and inconsistent.' },
  { level: 'Managed',                minScore: 1.0, maxScore: 2.0, color: '#F59E0B', desc: 'Basic processes exist. Some testing is planned but not standardized across teams.' },
  { level: 'Defined',                minScore: 2.0, maxScore: 3.0, color: '#3B82F6', desc: 'Standardized processes. Testing is integrated into the SDLC with clear roles and responsibilities.' },
  { level: 'Quantitatively Managed', minScore: 3.0, maxScore: 4.0, color: '#10B981', desc: 'Metrics-driven. Testing effectiveness is measured, analysed, and continuously improved.' },
  { level: 'Optimizing',             minScore: 4.0, maxScore: 5.01, color: '#8B5CF6', desc: 'Continuous optimization. AI-assisted, self-healing tests, production feedback loops.' },
];

// ── QUESTIONS ──
const QUESTIONS = [
  // Strategy & Planning
  { id:'s1', dim:'strategy', text:'Does a formal test strategy and test plan exist?', explanation:'A test strategy defines the overall approach, scope, risk areas, and types of testing. A test plan details what will be tested, by whom, and when.', options:[{l:'No strategy or plan',s:0},{l:'Informal / tribal knowledge only',s:1},{l:'Documented but not maintained',s:2},{l:'Documented, maintained, covers all types',s:3},{l:'Strategy aligned with risk, reviewed quarterly',s:4},{l:'Living document, continuously optimised with data',s:5}]},
  { id:'s2', dim:'strategy', text:'Are test activities integrated into the Definition of Done?', explanation:'The DoD should include quality gates such as unit test coverage, code review, and passing CI checks.', options:[{l:'No DoD exists',s:0},{l:'DoD exists but omits testing',s:1},{l:'DoD mentions testing informally',s:2},{l:'DoD includes specific test criteria',s:3},{l:'DoD enforced via CI/CD gates',s:4},{l:'DoD continuously refined based on defect analysis',s:5}]},
  { id:'s3', dim:'strategy', text:'Is there a risk-based approach to test prioritisation?', explanation:'Risk-based testing focuses effort on areas most likely to fail or cause the highest business impact.', options:[{l:'No risk assessment',s:0},{l:'Ad-hoc risk considerations',s:1},{l:'Basic risk matrix exists',s:2},{l:'Risk-based prioritisation drives test selection',s:3},{l:'Risk models updated each release',s:4},{l:'Automated risk scoring from code changes + prod data',s:5}]},
  // Unit Testing
  { id:'u1', dim:'unit', text:'Do unit tests exist for the codebase?', explanation:'Unit tests verify individual functions/methods in isolation — the fastest and cheapest automated testing.', options:[{l:'No unit tests',s:0},{l:'Some (<20% coverage)',s:1},{l:'20–40% coverage',s:2},{l:'40–60% coverage',s:3},{l:'60–80% coverage',s:4},{l:'>80% + mutation testing',s:5}]},
  { id:'u2', dim:'unit', text:'Are unit tests integrated into the CI pipeline?', explanation:'Unit tests should run automatically on every commit and PR for fast feedback.', options:[{l:'Not in CI',s:0},{l:'Run manually before merge',s:1},{l:'In CI but not blocking',s:2},{l:'In CI, block merge on failure',s:3},{l:'Coverage gating (min threshold)',s:4},{l:'Coverage gating + trend analysis + flaky detection',s:5}]},
  { id:'u3', dim:'unit', text:'Is code coverage measured and tracked over time?', explanation:'Coverage metrics (line, branch, mutation) should be tracked to prevent erosion.', options:[{l:'No measurement',s:0},{l:'Measured locally by devs',s:1},{l:'Reported in CI, not tracked',s:2},{l:'Tracked in SonarQube with trends',s:3},{l:'Gated in CI + dashboard trends',s:4},{l:'Coverage + mutation testing + dead code analysis',s:5}]},
  // Integration & Contract
  { id:'i1', dim:'integration', text:'Are integration tests implemented for service interactions?', explanation:'Integration tests verify multiple components work together: API calls, DB, message queues.', options:[{l:'No integration tests',s:0},{l:'Ad-hoc manual integration testing',s:1},{l:'Some automated for critical paths',s:2},{l:'Automated for most service interactions',s:3},{l:'Comprehensive: all endpoints + error paths',s:4},{l:'Full suite + contract + chaos engineering',s:5}]},
  { id:'i2', dim:'integration', text:'Are contract tests implemented for API boundaries?', explanation:'Contract testing (Pact) verifies consumers and providers agree on API contracts.', options:[{l:'No contract testing',s:0},{l:'API docs exist but not verified',s:1},{l:'OpenAPI/Swagger specs maintained',s:2},{l:'Pact consumer tests implemented',s:3},{l:'Full consumer + provider via Pact Broker',s:4},{l:'Contract tests + can-i-deploy in CI/CD',s:5}]},
  { id:'i3', dim:'integration', text:'Are integration tests executed in a realistic environment?', explanation:'Tests should run against real (or near-real) dependencies like databases, brokers, and partner services.', options:[{l:'No dedicated environment',s:0},{l:'Tests against mocks only',s:1},{l:'CI with Testcontainers',s:2},{l:'Shared DEV/TEST environment',s:3},{l:'Dedicated namespace (OpenShift, Kafka)',s:4},{l:'Ephemeral environments per PR',s:5}]},
  // Functional & System
  { id:'f1', dim:'functional', text:'Are functional/system tests executed?', explanation:'System tests verify end-to-end workflows spanning multiple applications.', options:[{l:'No system tests',s:0},{l:'Manual system testing only',s:1},{l:'Some automated E2E for critical flows',s:2},{l:'Automated regression suite for major journeys',s:3},{l:'Comprehensive E2E with data-driven scenarios',s:4},{l:'AI test generation + visual regression + accessibility',s:5}]},
  { id:'f2', dim:'functional', text:'Are test cases managed in a tool (e.g., qTest)?', explanation:'Test management tools provide traceability from requirements to test cases to execution results.', options:[{l:'No test management tool',s:0},{l:'Spreadsheets or wiki',s:1},{l:'Tool exists, partially used',s:2},{l:'All in qTest, linked to Jira',s:3},{l:'Full traceability: req → test → exec → defect',s:4},{l:'Automated sync CI→qTest + real-time dashboards',s:5}]},
  // Test Automation
  { id:'a1', dim:'automation', text:'What is the overall level of test automation?', explanation:'Automation maturity spans from none to fully self-healing, AI-optimised suites.', options:[{l:'No automation',s:0},{l:'<25% automated',s:1},{l:'25–50% automated',s:2},{l:'50–75% automated, stable',s:3},{l:'>75% automated, in CI/CD, low flakiness',s:4},{l:'>90% automated, self-healing, AI-optimised',s:5}]},
  { id:'a2', dim:'automation', text:'Are automated tests maintainable and following best practices?', explanation:'Sustainable automation needs POM, fixtures, proper assertions, and low flakiness.', options:[{l:'No framework',s:0},{l:'Fragile, unmaintained scripts',s:1},{l:'Basic framework, some reuse',s:2},{l:'Well-structured (POM, fixtures, helpers)',s:3},{l:'Retry logic, parallel exec, reporting',s:4},{l:'Self-healing selectors, AI dedup, optimal ordering',s:5}]},
  { id:'a3', dim:'automation', text:'Is automation integrated across CI → CD → CT?', explanation:'Automation should span from unit tests in CI to smoke tests in CD to regression in CT.', options:[{l:'No pipeline integration',s:0},{l:'CI only',s:1},{l:'CI + some post-deploy checks',s:2},{l:'CI + CD smoke tests (Tekton)',s:3},{l:'CI + CD + CT regression in TEST/UAT',s:4},{l:'Full CI+CD+CT + production synthetic monitoring',s:5}]},
  // Performance & Non-Functional
  { id:'p1', dim:'performance', text:'Are performance tests executed regularly?', explanation:'Performance testing: load, stress, endurance, and spike tests.', options:[{l:'No performance testing',s:0},{l:'Ad-hoc manual checks',s:1},{l:'Before major releases',s:2},{l:'Regular suite (k6, Gatling, JMeter)',s:3},{l:'Automated perf regression in CI/CD',s:4},{l:'Continuous perf monitoring + anomaly detection',s:5}]},
  { id:'p2', dim:'performance', text:'Is security testing integrated?', explanation:'Security testing: SAST, DAST, dependency scanning, pen testing.', options:[{l:'No security testing',s:0},{l:'Annual pen test only',s:1},{l:'SAST in SonarQube',s:2},{l:'SAST + dependency scanning in CI',s:3},{l:'SAST + DAST + container scanning',s:4},{l:'Full DevSecOps: SAST+DAST+IAST+runtime',s:5}]},
  // Environments & Data
  { id:'e1', dim:'environments', text:'How are test environments managed?', explanation:'Environments should be consistent, reproducible, and available on demand.', options:[{l:'No dedicated environments',s:0},{l:'Shared, manually configured',s:1},{l:'Dedicated per stage (DEV/TEST/UAT)',s:2},{l:'Infrastructure-as-Code managed',s:3},{l:'On-demand ephemeral (K8s namespaces)',s:4},{l:'Self-service, ephemeral, prod-parity',s:5}]},
  { id:'e2', dim:'environments', text:'How is test data managed?', explanation:'Test data management: synthetic generation, masking, state management.', options:[{l:'No strategy',s:0},{l:'Copy of prod (unmasked)',s:1},{l:'Masked prod subsets',s:2},{l:'Synthetic generators',s:3},{l:'Data factories with API setup/teardown',s:4},{l:'Full TDM platform with versioning',s:5}]},
  // Reporting & Metrics
  { id:'r1', dim:'reporting', text:'Is there a quality dashboard with key metrics?', explanation:'Real-time visibility into test results, coverage, defect trends, and release readiness.', options:[{l:'No dashboard',s:0},{l:'Manual reports (email/spreadsheet)',s:1},{l:'Basic CI reports (JUnit XML)',s:2},{l:'Allure reporting with historical trends',s:3},{l:'Centralised dashboard: CI + qTest + Sonar',s:4},{l:'Real-time quality intelligence + predictive analytics',s:5}]},
  { id:'r2', dim:'reporting', text:'Are defect metrics tracked and used for improvement?', explanation:'Metrics: escape rate, mean time to detect, defect density, root cause analysis.', options:[{l:'No defect tracking',s:0},{l:'Logged in Jira, not analysed',s:1},{l:'Basic reports (count, severity)',s:2},{l:'Trends, escape rate, root cause',s:3},{l:'Defect prediction + auto-categorisation',s:4},{l:'ML defect prediction influencing test prio',s:5}]},
  // Observability
  { id:'o1', dim:'observability', text:'Is production monitoring a feedback loop for testing?', explanation:'Observability (logs, metrics, traces) should inform test strategy and catch gaps.', options:[{l:'No production monitoring',s:0},{l:'Basic uptime monitoring',s:1},{l:'APM deployed (Dynatrace/Datadog)',s:2},{l:'Full observability: metrics+logs+traces',s:3},{l:'Prod insights → test case generation',s:4},{l:'Automated canary analysis + chaos engineering',s:5}]},
  { id:'o2', dim:'observability', text:'Are synthetic monitoring / smoke tests in production?', explanation:'Synthetic monitoring detects issues before users do.', options:[{l:'No synthetic monitoring',s:0},{l:'Manual spot checks',s:1},{l:'Health endpoints monitored',s:2},{l:'Automated smoke tests on schedule',s:3},{l:'Synthetic user journeys + alerting',s:4},{l:'Full synthetic + canary + auto-rollback',s:5}]},
];

module.exports = { DIMENSIONS, MATURITY_LEVELS, QUESTIONS };
