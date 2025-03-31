import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);

  constructor() { }

  setLoading(isLoading: boolean): void {
    this.loading.next(isLoading);
  }

  getLoadingState(): Observable<boolean> {
    return this.loading.asObservable();
  }
} 