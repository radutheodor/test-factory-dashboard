import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardData, ProductTeam } from '../models/dashboard.model';
import { QTestExecutionsResponse } from '../models/qtest.model';
import {
  PRODUCT_TEAMS,
  MOCK_SONAR,
  MOCK_CI,
  MOCK_DELIVERY,
  MOCK_COVERAGE,
} from '../config/teams.config';
import { MaturityService } from './maturity.service';
import { QTestService } from './qtest.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private maturityService: MaturityService,
    private qtestService: QTestService,
  ) {}

  getTeams(): ProductTeam[] {
    return PRODUCT_TEAMS;
  }

  /**
   * Returns dashboard data for a team.
   * Static mock data is returned synchronously; qTest data is fetched async.
   */
  getDashboardData(teamId: string): DashboardData | null {
    const team = PRODUCT_TEAMS.find(t => t.id === teamId);
    if (!team) return null;

    return {
      team,
      sonar: MOCK_SONAR[teamId] ?? {
        codeSmells: 0, bugs: 0, vulnerabilities: 0,
        coverage: 0, duplications: 0,
        qualityGateStatus: 'ERROR', lastAnalysis: '',
      },
      ciPipelines: MOCK_CI[teamId] ?? [],
      deliveryPipeline: MOCK_DELIVERY[teamId] ?? [],
      testPlans: [], // Replaced by live qTest data via getQTestExecutions()
      requirementCoverage: MOCK_COVERAGE[teamId] ?? {
        totalRequirements: 0, coveredRequirements: 0,
        uncoveredRequirements: 0, totalTestsCovering: 0,
        coveragePercentage: 0,
      },
      latestMaturityResult: this.maturityService.getLatestResultForTeam(team.name),
    };
  }

  /**
   * Fetches qTest test execution data for a team from the backend.
   * Returns null if the team has no qTestProjectId or if the API call fails.
   */
  getQTestExecutions(teamId: string): Observable<QTestExecutionsResponse | null> {
    const team = PRODUCT_TEAMS.find(t => t.id === teamId);
    if (!team?.qTestProjectId) return of(null);
    return this.qtestService.getRecentExecutions(team.qTestProjectId);
  }
}
