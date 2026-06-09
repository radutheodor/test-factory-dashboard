// ════════════════════════════════════════════════════════════════
// Roadmap Actions Library
// ════════════════════════════════════════════════════════════════
// Actions per dimension, filtered at runtime by maxScore.
// - Backend: require()
// - Frontend: GET /api/roadmap-config
// ════════════════════════════════════════════════════════════════

const ROADMAP_ACTIONS = {
  strategy: [
    { maxScore:1, title:'Create a formal test strategy document', desc:'Define test types, scope, tools, environments, and risk approach. Align with product architecture.', effort:'1–2 weeks', tags:['Foundation','Documentation'] },
    { maxScore:2, title:'Integrate testing into Definition of Done', desc:'Add specific test criteria (unit tests, code review, CI green) to the team DoD and enforce in sprint reviews.', effort:'1 sprint', tags:['Process','Quick Win'] },
    { maxScore:3, title:'Implement risk-based test prioritisation', desc:'Create a risk matrix mapping business impact × likelihood of failure. Use it to prioritise regression tests.', effort:'2–3 weeks', tags:['Strategy','Risk'] },
    { maxScore:4, title:'Automate risk scoring from code changes', desc:'Use code change metrics (files changed, complexity delta) to auto-score risk and adjust test selection.', effort:'1–2 months', tags:['Advanced','Automation'] },
  ],
  unit: [
    { maxScore:1, title:'Establish unit testing practice', desc:'Set up a test framework (JUnit/Jest/pytest), write tests for new code, target 20% coverage as first milestone.', effort:'1–2 weeks', tags:['Foundation','Quick Win'] },
    { maxScore:2, title:'Integrate unit tests into CI pipeline', desc:'Configure CI to run unit tests on every PR. Make failures block merge.', effort:'1–2 days', tags:['CI/CD','Quick Win'] },
    { maxScore:3, title:'Set up coverage gating in CI', desc:'Configure SonarQube quality gate with minimum coverage threshold (start at 40%, increase over time).', effort:'1–2 days', tags:['Quality Gate','Quick Win'] },
    { maxScore:4, title:'Add mutation testing and trend analysis', desc:'Integrate mutation testing (Stryker/PITest) to validate test quality beyond line coverage.', effort:'2–4 weeks', tags:['Advanced','Quality'] },
  ],
  integration: [
    { maxScore:1, title:'Write integration tests for critical API paths', desc:'Identify top 5 most critical service interactions and write automated tests for happy path + error cases.', effort:'1–2 weeks', tags:['Foundation','API'] },
    { maxScore:2, title:'Implement contract testing with Pact', desc:'Set up Pact consumer tests for your API consumers. Publish contracts to a Pact Broker.', effort:'2–3 weeks', tags:['Contract Testing','Pact'] },
    { maxScore:3, title:'Add provider verification and can-i-deploy', desc:'Configure provider-side verification in CI. Use can-i-deploy before promotions to TEST/UAT.', effort:'1–2 weeks', tags:['Contract Testing','Safety'] },
    { maxScore:4, title:'Enable ephemeral test environments per PR', desc:'Use Kubernetes namespaces to spin up isolated environments with real dependencies for each PR.', effort:'1–2 months', tags:['Advanced','Infrastructure'] },
  ],
  functional: [
    { maxScore:1, title:'Automate top 10 critical user journeys', desc:'Identify the most important E2E flows and automate them using Playwright/Cypress/Selenium.', effort:'2–4 weeks', tags:['Automation','E2E'] },
    { maxScore:2, title:'Set up test management in qTest', desc:'Migrate test cases to qTest. Link to Jira requirements for traceability.', effort:'2–3 weeks', tags:['Process','Traceability'] },
    { maxScore:3, title:'Achieve full requirement → test → defect traceability', desc:'Ensure every requirement has linked test cases and every test failure generates a tracked defect.', effort:'1 sprint', tags:['Quality','Process'] },
    { maxScore:4, title:'Automate CI → qTest result sync', desc:'Push CI test results automatically to qTest. Generate real-time coverage and execution dashboards.', effort:'2–4 weeks', tags:['Integration','Reporting'] },
  ],
  automation: [
    { maxScore:1, title:'Set up a test automation framework', desc:'Choose and set up a framework (Playwright, RestAssured, etc.). Establish page object pattern and shared helpers.', effort:'1–2 weeks', tags:['Foundation','Framework'] },
    { maxScore:2, title:'Automate 50% of regression tests', desc:'Focus on stable, high-value tests first. Track automation progress weekly.', effort:'1–2 months', tags:['Automation','Regression'] },
    { maxScore:3, title:'Integrate automation across CI + CD + CT', desc:'Run unit/contract in CI, smoke in CD (Tekton), regression in CT (ADO+Tekton).', effort:'2–4 weeks', tags:['Pipeline','Integration'] },
    { maxScore:4, title:'Add self-healing and AI-optimised execution', desc:'Implement smart selectors, test deduplication, and optimal execution ordering.', effort:'2–3 months', tags:['Advanced','AI'] },
  ],
  performance: [
    { maxScore:1, title:'Run a baseline performance test', desc:'Use k6 or Gatling to establish baseline response times and throughput for critical APIs.', effort:'1 week', tags:['Foundation','Baseline'] },
    { maxScore:2, title:'Integrate SAST + dependency scanning in CI', desc:'Add SonarQube security rules + Snyk/OWASP dependency check to the CI pipeline.', effort:'1–2 days', tags:['Security','Quick Win'] },
    { maxScore:3, title:'Automate performance regression detection', desc:'Set performance budgets. Fail CI if response times regress beyond thresholds.', effort:'2–3 weeks', tags:['Performance','CI/CD'] },
    { maxScore:4, title:'Add DAST + container scanning', desc:'Integrate ZAP DAST scans and container image scanning into the pipeline.', effort:'2–4 weeks', tags:['Security','Advanced'] },
  ],
  environments: [
    { maxScore:1, title:'Provision dedicated TEST and UAT environments', desc:'Create separate environments per stage. Document access and configuration.', effort:'1–2 weeks', tags:['Infrastructure','Foundation'] },
    { maxScore:2, title:'Adopt Infrastructure-as-Code for environments', desc:'Manage all test environments via Terraform/Ansible. Enable reproducible provisioning.', effort:'2–4 weeks', tags:['IaC','Automation'] },
    { maxScore:3, title:'Implement synthetic test data generators', desc:'Replace production data copies with deterministic, synthetic test data factories.', effort:'2–4 weeks', tags:['Test Data','Quality'] },
    { maxScore:4, title:'Enable on-demand ephemeral environments', desc:'Self-service environment creation via K8s namespaces with automated teardown.', effort:'1–2 months', tags:['Advanced','Self-Service'] },
  ],
  reporting: [
    { maxScore:1, title:'Set up Allure reporting for test results', desc:'Integrate Allure report generation into CI. Publish as pipeline artifact.', effort:'1–2 days', tags:['Reporting','Quick Win'] },
    { maxScore:2, title:'Track defect metrics and escape rate', desc:'Define and measure: defect density, escape rate, MTTD, and root cause categories.', effort:'1–2 weeks', tags:['Metrics','Process'] },
    { maxScore:3, title:'Build a centralised quality dashboard', desc:'Aggregate data from CI, SonarQube, qTest, and ServiceNow into one dashboard.', effort:'2–4 weeks', tags:['Dashboard','Integration'] },
    { maxScore:4, title:'Add predictive quality analytics', desc:'Use historical data to predict defect-prone areas and optimise test allocation.', effort:'2–3 months', tags:['Advanced','AI'] },
  ],
  observability: [
    { maxScore:1, title:'Deploy APM and health monitoring', desc:'Set up Dynatrace/Datadog/Grafana for production metrics, logs, and basic alerting.', effort:'1–2 weeks', tags:['Monitoring','Foundation'] },
    { maxScore:2, title:'Implement full observability stack', desc:'Correlate metrics + logs + traces. Create dashboards for service health and performance.', effort:'2–4 weeks', tags:['Observability','Infrastructure'] },
    { maxScore:3, title:'Create production → test feedback loop', desc:'Use production error patterns to automatically generate new test cases for regression suites.', effort:'1–2 months', tags:['Feedback Loop','Advanced'] },
    { maxScore:4, title:'Implement canary deployments + auto-rollback', desc:'Deploy with canary analysis. Automatically roll back if error rates or latency exceed thresholds.', effort:'2–3 months', tags:['Canary','Resilience'] },
  ],
};

module.exports = { ROADMAP_ACTIONS };
