import { Injectable } from '@angular/core';
import {
  AssessmentAnswer,
  AssessmentResult,
  DimensionScore,
  MaturityLevel,
  MaturityQuestion,
} from '../models/maturity.model';
import { DIMENSIONS, MATURITY_LEVELS, QUESTIONS } from '../config/maturity.config';

@Injectable({ providedIn: 'root' })
export class MaturityService {
  // ── In-Memory Storage ───────────────────────────────────
  private results: AssessmentResult[] = [];

  getQuestions(): MaturityQuestion[] {
    return QUESTIONS;
  }

  getQuestionsByDimension(): Map<string, MaturityQuestion[]> {
    const map = new Map<string, MaturityQuestion[]>();
    for (const dim of DIMENSIONS) {
      map.set(dim.id, QUESTIONS.filter(q => q.dimension === dim.id));
    }
    return map;
  }

  getDimensions() {
    return DIMENSIONS;
  }

  getMaturityLevels() {
    return MATURITY_LEVELS;
  }

  // ── Scoring Formula ─────────────────────────────────────
  // overallScore = Σ (dimensionAvg × weight / 100)
  // Each dimension avg is on a 0–5 scale.
  // The overall score is also 0–5.
  calculateResult(
    teamName: string,
    assessedBy: string,
    answers: AssessmentAnswer[]
  ): AssessmentResult {
    const dimensionScores: DimensionScore[] = DIMENSIONS.map(dim => {
      const dimAnswers = answers.filter(a => a.dimension === dim.id);
      const rawScore =
        dimAnswers.length > 0
          ? dimAnswers.reduce((sum, a) => sum + a.score, 0) / dimAnswers.length
          : 0;
      const weightedScore = rawScore * (dim.weight / 100);
      return {
        dimensionId: dim.id,
        dimensionName: dim.name,
        rawScore: Math.round(rawScore * 100) / 100,
        weightedScore: Math.round(weightedScore * 1000) / 1000,
        maxPossible: 5,
        percentage: Math.round((rawScore / 5) * 100),
      };
    });

    const overallScore =
      Math.round(
        dimensionScores.reduce((sum, ds) => sum + ds.weightedScore, 0) * 100
      ) / 100;

    const maturityLevel = this.getMaturityLevel(overallScore);

    const result: AssessmentResult = {
      id: this.generateId(),
      teamName,
      assessedBy,
      date: new Date().toISOString(),
      answers,
      dimensionScores,
      overallScore,
      maturityLevel,
    };

    // Store in memory
    this.results.push(result);
    return result;
  }

  getMaturityLevel(score: number): MaturityLevel {
    for (const level of MATURITY_LEVELS) {
      if (score >= level.minScore && score < level.maxScore) {
        return level.level;
      }
    }
    // Edge case: exactly 5.0
    return 'Optimizing';
  }

  getMaturityLevelConfig(level: MaturityLevel) {
    return MATURITY_LEVELS.find(l => l.level === level);
  }

  getStoredResults(): AssessmentResult[] {
    return [...this.results];
  }

  getLatestResultForTeam(teamName: string): AssessmentResult | undefined {
    return this.results
      .filter(r => r.teamName === teamName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  private generateId(): string {
    return 'assess-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
  }
}
