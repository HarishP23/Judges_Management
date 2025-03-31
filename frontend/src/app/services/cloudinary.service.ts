import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // Cloudinary configuration
  private cloudName = 'dud9kd5s4'; // Replace with your Cloudinary cloud name
  private uploadPreset = 'judges_preset'; // Replace with your Cloudinary upload preset

  constructor() { }

  uploadImage(file: File): Observable<any> {
    return from(new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);

      fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data);
        } else {
          reject(new Error('Upload failed'));
        }
      })
      .catch(error => reject(error));
    }));
  }
} 