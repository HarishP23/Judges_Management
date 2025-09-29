import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Judge } from '../models/judge.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class JudgeService {
  // Build API URL from <base href> so it always targets /<context>/api/judges
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    // Prefer context from current path (works even if base href is cached/incorrect)
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const context = pathSegments.length > 0 ? `/${pathSegments[0]}` : '';

    // Fallback to <base href> if context is empty
    let base = context;
    if (!base) {
      const baseEl = document.getElementsByTagName('base')[0];
      const baseHref = (baseEl && baseEl.getAttribute('href')) ? baseEl.getAttribute('href') as string : '/';
      base = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;
    }

    this.apiUrl = `${base}/api/judges`;
  }

  getAllJudges(): Observable<Judge[]> {
    return this.http.get<ApiResponse<Judge[]>>(this.apiUrl)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getJudgeById(id: number): Observable<Judge> {
    return this.http.get<ApiResponse<Judge>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createJudge(judge: Judge): Observable<Judge> {
    return this.http.post<ApiResponse<Judge>>(this.apiUrl, judge)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateJudge(id: number, judge: Judge): Observable<Judge> {
    return this.http.put<ApiResponse<Judge>>(`${this.apiUrl}/${id}`, judge)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteJudge(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => undefined),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 