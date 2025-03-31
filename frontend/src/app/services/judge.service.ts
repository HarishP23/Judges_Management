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
  private apiUrl = 'http://localhost:8080/api/judges';

  constructor(private http: HttpClient) { }

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