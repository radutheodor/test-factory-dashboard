// ════════════════════════════════════════════════════════════════
// PRODUCT TEAMS & MOCK DATA CONFIGURATION
// ════════════════════════════════════════════════════════════════
// Edit this file to add/remove teams and update mock dashboard data.
// In production, this data would come from API calls to Sonar, qTest, ADO, etc.
// ════════════════════════════════════════════════════════════════

import {
  ProductTeam,
  SonarMetrics,
  CIStatus,
  DeliveryPipelineStage,
  TestPlan,
  RequirementCoverage,
} from '../models/dashboard.model';

// ── PRODUCT TEAMS ───────────────────────────────────────────
export const PRODUCT_TEAMS: ProductTeam[] = [
  {
    id: 'order-mgmt',
    name: 'Order Management',
    description: 'Core order processing, fulfilment, and lifecycle management',
    techLead: 'Alice Chen',
    sonarProjectKey: 'com.company:order-mgmt',
    sonarDashboardUrl: 'https://sonar.company.com/dashboard?id=com.company:order-mgmt',
    qTestProjectId: 'QT-101',
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    description: 'Payment processing, fraud detection, and reconciliation',
    techLead: 'Bob Martinez',
    sonarProjectKey: 'com.company:payment-gw',
    sonarDashboardUrl: 'https://sonar.company.com/dashboard?id=com.company:payment-gw',
    qTestProjectId: 'QT-102',
  },
  {
    id: 'inventory-svc',
    name: 'Inventory Service',
    description: 'Stock management, warehouse integration, and availability checks',
    techLead: 'Carol Wu',
    sonarProjectKey: 'com.company:inventory-svc',
    sonarDashboardUrl: 'https://sonar.company.com/dashboard?id=com.company:inventory-svc',
    qTestProjectId: 'QT-103',
  },
  {
    id: 'customer-portal',
    name: 'Customer Portal',
    description: 'Self-service portal for customer account management',
    techLead: 'David Kim',
    sonarProjectKey: 'com.company:customer-portal',
    sonarDashboardUrl: 'https://sonar.company.com/dashboard?id=com.company:customer-portal',
    qTestProjectId: 'QT-104',
  },
];

// ── MOCK DATA PER TEAM ──────────────────────────────────────
export const MOCK_SONAR: Record<string, SonarMetrics> = {
  'order-mgmt': {
    codeSmells: 142, bugs: 3, vulnerabilities: 1,
    coverage: 68.4, duplications: 4.2,
    qualityGateStatus: 'OK', lastAnalysis: '2026-03-05T14:22:00Z',
  },
  'payment-gateway': {
    codeSmells: 87, bugs: 0, vulnerabilities: 0,
    coverage: 82.1, duplications: 2.8,
    qualityGateStatus: 'OK', lastAnalysis: '2026-03-05T16:05:00Z',
  },
  'inventory-svc': {
    codeSmells: 234, bugs: 12, vulnerabilities: 3,
    coverage: 41.3, duplications: 8.7,
    qualityGateStatus: 'ERROR', lastAnalysis: '2026-03-04T09:30:00Z',
  },
  'customer-portal': {
    codeSmells: 178, bugs: 5, vulnerabilities: 2,
    coverage: 55.9, duplications: 5.4,
    qualityGateStatus: 'WARN', lastAnalysis: '2026-03-05T11:15:00Z',
  },
};

export const MOCK_CI: Record<string, CIStatus[]> = {
  'order-mgmt': [
    { pipelineName: 'CI - Component Tests', branch: 'release/3.2', status: 'succeeded', startTime: '2026-03-05T14:00:00Z', duration: '4m 32s', testResults: { passed: 187, failed: 0, skipped: 3 } },
    { pipelineName: 'CI - Contract Tests', branch: 'release/3.2', status: 'succeeded', startTime: '2026-03-05T14:05:00Z', duration: '1m 48s', testResults: { passed: 24, failed: 0, skipped: 0 } },
  ],
  'payment-gateway': [
    { pipelineName: 'CI - Component Tests', branch: 'release/2.8', status: 'succeeded', startTime: '2026-03-05T15:30:00Z', duration: '6m 12s', testResults: { passed: 312, failed: 0, skipped: 1 } },
    { pipelineName: 'CI - Contract Tests', branch: 'release/2.8', status: 'succeeded', startTime: '2026-03-05T15:37:00Z', duration: '2m 05s', testResults: { passed: 41, failed: 0, skipped: 0 } },
  ],
  'inventory-svc': [
    { pipelineName: 'CI - Component Tests', branch: 'release/1.5', status: 'failed', startTime: '2026-03-04T09:00:00Z', duration: '3m 18s', testResults: { passed: 94, failed: 7, skipped: 2 } },
    { pipelineName: 'CI - Contract Tests', branch: 'release/1.5', status: 'succeeded', startTime: '2026-03-04T09:04:00Z', duration: '1m 22s', testResults: { passed: 12, failed: 0, skipped: 0 } },
  ],
  'customer-portal': [
    { pipelineName: 'CI - Component Tests', branch: 'release/4.1', status: 'succeeded', startTime: '2026-03-05T10:45:00Z', duration: '5m 50s', testResults: { passed: 203, failed: 0, skipped: 8 } },
    { pipelineName: 'CI - Contract Tests', branch: 'release/4.1', status: 'running', startTime: '2026-03-05T10:52:00Z', duration: '—', testResults: undefined },
  ],
};

export const MOCK_DELIVERY: Record<string, DeliveryPipelineStage[]> = {
  'order-mgmt': [
    { name: 'CI', environment: 'CI', status: 'succeeded', version: '3.2.1', lastDeployed: '2026-03-05T14:10:00Z' },
    { name: 'DEV', environment: 'DEV', status: 'succeeded', version: '3.2.1', lastDeployed: '2026-03-05T14:25:00Z' },
    { name: 'TEST', environment: 'TEST', status: 'succeeded', version: '3.2.1', lastDeployed: '2026-03-05T15:00:00Z' },
    { name: 'UAT', environment: 'UAT', status: 'running', version: '3.2.0', lastDeployed: '2026-03-05T16:00:00Z' },
  ],
  'payment-gateway': [
    { name: 'CI', environment: 'CI', status: 'succeeded', version: '2.8.3', lastDeployed: '2026-03-05T15:40:00Z' },
    { name: 'DEV', environment: 'DEV', status: 'succeeded', version: '2.8.3', lastDeployed: '2026-03-05T15:55:00Z' },
    { name: 'TEST', environment: 'TEST', status: 'succeeded', version: '2.8.3', lastDeployed: '2026-03-05T16:30:00Z' },
    { name: 'UAT', environment: 'UAT', status: 'succeeded', version: '2.8.2', lastDeployed: '2026-03-04T10:00:00Z' },
  ],
  'inventory-svc': [
    { name: 'CI', environment: 'CI', status: 'failed', version: '1.5.0', lastDeployed: '2026-03-04T09:05:00Z' },
    { name: 'DEV', environment: 'DEV', status: 'succeeded', version: '1.4.9', lastDeployed: '2026-03-03T14:00:00Z' },
    { name: 'TEST', environment: 'TEST', status: 'pending', version: '1.4.8', lastDeployed: '2026-03-02T11:00:00Z' },
    { name: 'UAT', environment: 'UAT', status: 'pending', version: '1.4.7', lastDeployed: '2026-02-28T09:00:00Z' },
  ],
  'customer-portal': [
    { name: 'CI', environment: 'CI', status: 'succeeded', version: '4.1.2', lastDeployed: '2026-03-05T10:55:00Z' },
    { name: 'DEV', environment: 'DEV', status: 'succeeded', version: '4.1.2', lastDeployed: '2026-03-05T11:20:00Z' },
    { name: 'TEST', environment: 'TEST', status: 'running', version: '4.1.1', lastDeployed: '2026-03-05T12:00:00Z' },
    { name: 'UAT', environment: 'UAT', status: 'pending', version: '4.1.0', lastDeployed: '2026-03-04T15:00:00Z' },
  ],
};

export const MOCK_TEST_PLANS: Record<string, TestPlan[]> = {
  'order-mgmt': [
    { id: 'TP-301', name: 'Release 3.2 Regression', release: '3.2', status: 'Active', totalTests: 245, passed: 198, failed: 12, blocked: 5, notRun: 30, lastUpdated: '2026-03-05T16:00:00Z' },
    { id: 'TP-298', name: 'Release 3.1 Regression', release: '3.1', status: 'Closed', totalTests: 230, passed: 225, failed: 3, blocked: 0, notRun: 2, lastUpdated: '2026-02-20T10:00:00Z' },
  ],
  'payment-gateway': [
    { id: 'TP-315', name: 'Release 2.8 Regression', release: '2.8', status: 'Active', totalTests: 310, passed: 290, failed: 5, blocked: 2, notRun: 13, lastUpdated: '2026-03-05T17:00:00Z' },
  ],
  'inventory-svc': [
    { id: 'TP-288', name: 'Release 1.5 Regression', release: '1.5', status: 'Draft', totalTests: 120, passed: 45, failed: 18, blocked: 10, notRun: 47, lastUpdated: '2026-03-04T09:30:00Z' },
  ],
  'customer-portal': [
    { id: 'TP-320', name: 'Release 4.1 Regression', release: '4.1', status: 'Active', totalTests: 185, passed: 140, failed: 8, blocked: 3, notRun: 34, lastUpdated: '2026-03-05T12:00:00Z' },
    { id: 'TP-310', name: 'Release 4.0 Regression', release: '4.0', status: 'Closed', totalTests: 175, passed: 170, failed: 4, blocked: 0, notRun: 1, lastUpdated: '2026-02-15T14:00:00Z' },
  ],
};

export const MOCK_COVERAGE: Record<string, RequirementCoverage> = {
  'order-mgmt': { totalRequirements: 62, coveredRequirements: 48, uncoveredRequirements: 14, totalTestsCovering: 312, coveragePercentage: 77.4 },
  'payment-gateway': { totalRequirements: 45, coveredRequirements: 42, uncoveredRequirements: 3, totalTestsCovering: 287, coveragePercentage: 93.3 },
  'inventory-svc': { totalRequirements: 38, coveredRequirements: 18, uncoveredRequirements: 20, totalTestsCovering: 89, coveragePercentage: 47.4 },
  'customer-portal': { totalRequirements: 50, coveredRequirements: 35, uncoveredRequirements: 15, totalTestsCovering: 198, coveragePercentage: 70.0 },
};
