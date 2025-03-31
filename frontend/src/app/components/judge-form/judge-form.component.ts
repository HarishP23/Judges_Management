import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperienceLevel, Judge } from '../../models/judge.model';
import { JudgeService } from '../../services/judge.service';
import { LoadingService } from '../../services/loading.service';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-judge-form',
  templateUrl: './judge-form.component.html'
})
export class JudgeFormComponent implements OnInit {
  judgeForm!: FormGroup;
  isEditMode = false;
  judgeId: number | null = null;
  error: string | null = null;
  experienceLevels = Object.values(ExperienceLevel);

  // For image upload
  imagePreview: string | null = null;
  imageFile: File | null = null;
  uploadProgress = 0;
  imageUploading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private judgeService: JudgeService,
    private loadingService: LoadingService,
    private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.judgeId = +id;
      this.loadJudge(this.judgeId);
    }
  }

  initForm(): void {
    this.judgeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("^\\+?[0-9]{10,15}$")]],
      experienceLevel: [ExperienceLevel.NOVICE, Validators.required],
      fieldSpecialization: ['', Validators.required],
      profilePictureUrl: ['']
    });
  }

  loadJudge(id: number): void {
    this.loadingService.setLoading(true);
    this.judgeService.getJudgeById(id).subscribe({
      next: (judge) => {
        this.judgeForm.patchValue(judge);
        if (judge.profilePictureUrl) {
          this.imagePreview = judge.profilePictureUrl;
        }
        this.loadingService.setLoading(false);
      },
      error: (err) => {
        this.error = err.message;
        this.loadingService.setLoading(false);
      }
    });
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageFile = fileInput.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  uploadImage(): Promise<string | null> {
    if (!this.imageFile) {
      return Promise.resolve(this.judgeForm.get('profilePictureUrl')?.value || null);
    }

    this.imageUploading = true;
    return new Promise((resolve, reject) => {
      this.cloudinaryService.uploadImage(this.imageFile!).subscribe({
        next: (response) => {
          this.imageUploading = false;
          resolve(response.secure_url);
        },
        error: (err) => {
          this.imageUploading = false;
          reject(err);
        }
      });
    });
  }

  onSubmit(): void {
    if (this.judgeForm.invalid) {
      this.markFormGroupTouched(this.judgeForm);
      return;
    }

    this.loadingService.setLoading(true);
    
    this.uploadImage()
      .then(imageUrl => {
        const formData = this.judgeForm.value;
        if (imageUrl) {
          formData.profilePictureUrl = imageUrl;
        }

        const judge: Judge = formData;

        if (this.isEditMode && this.judgeId) {
          this.judgeService.updateJudge(this.judgeId, judge).subscribe({
            next: () => {
              this.loadingService.setLoading(false);
              this.router.navigate(['/judges']);
            },
            error: (err) => {
              this.error = err.message;
              this.loadingService.setLoading(false);
            }
          });
        } else {
          this.judgeService.createJudge(judge).subscribe({
            next: () => {
              this.loadingService.setLoading(false);
              this.router.navigate(['/judges']);
            },
            error: (err) => {
              this.error = err.message;
              this.loadingService.setLoading(false);
            }
          });
        }
      })
      .catch(err => {
        this.error = 'Failed to upload image: ' + err.message;
        this.loadingService.setLoading(false);
      });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
} 