// ════════════════════════════════════════════════════════════════
// Maturity Assessment Models
// ════════════════════════════════════════════════════════════════

export interface MaturityQuestion {
  id: string;
  dimension: string;
  text: string;
  explanation: string;
  options: MaturityOption[];
}

export interface MaturityOption {
  label: string;
  score: number; // 0–5
  description?: string;
}

export interface DimensionConfig {
  id: string;
  name: string;
  weight: number; // percentage weight (all should sum to 100)
  icon: string;   // Material icon name
  color: string;  // CSS color
}

export interface AssessmentAnswer {
  questionId: string;
  dimension: string;
  score: number;
}

export interface AssessmentResult {
  id: string;
  teamName: string;
  assessedBy: string;
  date: string;
  answers: AssessmentAnswer[];
  dimensionScores: DimensionScore[];
  overallScore: number;
  maturityLevel: MaturityLevel;
}

export interface DimensionScore {
  dimensionId: string;
  dimensionName: string;
  rawScore: number;      // average of question scores (0–5)
  weightedScore: number; // rawScore * (weight / 100)
  maxPossible: number;
  percentage: number;
}

export type MaturityLevel =
  | 'Initial'
  | 'Managed'
  | 'Defined'
  | 'Quantitatively Managed'
  | 'Optimizing';

export interface MaturityLevelConfig {
  level: MaturityLevel;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
}
