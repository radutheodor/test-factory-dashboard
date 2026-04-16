// ════════════════════════════════════════════════════════════════
// qTest Service (Frontend — Angular)
// ════════════════════════════════════════════════════════════════
// Calls the Test Factory backend, NOT the qTest API directly.
// The backend handles authentication and data processing.
// ════════════════════════════════════════════════════════════════

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QTestExecutionsResponse } from '../models/qtest.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QTestService {

  private readonly apiBase = environment.apiBaseUrl; // e.g. 'http://localhost:3000'

  constructor(private http: HttpClient) {}

  /**
   * Fetches recent test executions (last 31 days) for a given qTest project,
   * grouped by release with status tallies.
   *
   * Calls: GET {apiBase}/api/qtest/executions/{projectId}
   *
   * @param projectId - qTest project ID (from teams.config.ts)
   * @returns Observable with portal URL and release execution data
   */
  getRecentExecutions(projectId: string | number): Observable<QTestExecutionsResponse | null> {
    return this.http
      .get<QTestExecutionsResponse>(`${this.apiBase}/api/qtest/executions/${projectId}`)
      .pipe(
        catchError(err => {
          console.error('[QTestService] Failed to fetch executions:', err);
          return of(null);
        })
      );
  }
}
