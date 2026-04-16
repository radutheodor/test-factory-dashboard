// ════════════════════════════════════════════════════════════════
// Dashboard Models
// ════════════════════════════════════════════════════════════════

export interface ProductTeam {
  id: string;
  name: string;
  description: string;
  techLead: string;
  sonarProjectKey?: string;
  sonarDashboardUrl?: string;
  adoUrl?: string;
  snowUrl?: string;
  qTestProjectId?: string | number;
}

export interface SonarMetrics {
  codeSmells: number;
  bugs: number;
  vulnerabilities: number;
  coverage: number;        // percentage
  duplications: number;    // percentage
  qualityGateStatus: 'OK' | 'WARN' | 'ERROR';
  lastAnalysis: string;
}

export interface CIStatus {
  pipelineName: string;
  branch: string;
  status: 'succeeded' | 'failed' | 'running' | 'queued' | 'canceled';
  startTime: string;
  duration: string;
  testResults?: {
    passed: number;
    failed: number;
    skipped: number;
  };
}

export interface DeliveryPipelineStage {
  name: string;
  environment: 'CI' | 'DEV' | 'TEST' | 'UAT' | 'PROD';
  status: 'succeeded' | 'failed' | 'running' | 'pending' | 'skipped';
  version?: string;
  lastDeployed?: string;
}

export interface TestPlan {
  id: string;
  name: string;
  release: string;
  status: 'Active' | 'Closed' | 'Draft';
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  notRun: number;
  lastUpdated: string;
}

export interface RequirementCoverage {
  totalRequirements: number;
  coveredRequirements: number;
  uncoveredRequirements: number;
  totalTestsCovering: number;
  coveragePercentage: number;
}

export interface DashboardData {
  team: ProductTeam;
  sonar: SonarMetrics;
  ciPipelines: CIStatus[];
  deliveryPipeline: DeliveryPipelineStage[];
  testPlans: TestPlan[];
  requirementCoverage: RequirementCoverage;
  latestMaturityResult?: import('./maturity.model').AssessmentResult;
}
