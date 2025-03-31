import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-overlay" *ngIf="loading">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.getLoadingState().subscribe(state => {
      this.loading = state;
    });
  }
} 