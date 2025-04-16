import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-semibold" routerLink="/">
          <i class="fas fa-gavel me-2"></i>Judges Management
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto gap-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="/judges" routerLinkActive="active">
                <i class="fas fa-users me-1"></i> Judges List
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/judges/add" routerLinkActive="active">
                <i class="fas fa-user-plus me-1"></i> Add Judge
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link {
      transition: background-color 0.3s, color 0.3s;
      border-radius: 0.375rem;
    }

    .nav-link.active, .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
  `]
})
export class NavbarComponent {}
