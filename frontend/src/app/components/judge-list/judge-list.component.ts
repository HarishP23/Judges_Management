import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Judge, ExperienceLevelLabels } from '../../models/judge.model';
import { JudgeService } from '../../services/judge.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-judge-list',
  templateUrl: './judge-list.component.html'
})
export class JudgeListComponent implements OnInit {
  judges: Judge[] = [];
  experienceLevelLabels = ExperienceLevelLabels;
  error: string | null = null;

  constructor(
    private judgeService: JudgeService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadJudges();
  }

  loadJudges(): void {
    this.loadingService.setLoading(true);
    this.judgeService.getAllJudges().subscribe({
      next: (data) => {
        this.judges = data;
        this.loadingService.setLoading(false);
      },
      error: (err) => {
        this.error = err.message;
        this.loadingService.setLoading(false);
      }
    });
  }

  editJudge(id: number): void {
    this.router.navigate(['/judges/edit', id]);
  }

  deleteJudge(id: number): void {
    if (confirm('Are you sure you want to delete this judge?')) {
      this.loadingService.setLoading(true);
      this.judgeService.deleteJudge(id).subscribe({
        next: () => {
          this.loadJudges();
        },
        error: (err) => {
          this.error = err.message;
          this.loadingService.setLoading(false);
        }
      });
    }
  }
} 