import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
    <app-loading-spinner></app-loading-spinner>
  `
})
export class AppComponent {
  title = 'Judges Management System';
} 