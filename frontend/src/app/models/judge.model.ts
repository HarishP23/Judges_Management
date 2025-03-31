export enum ExperienceLevel {
  NOVICE = 'NOVICE',
  INTERMEDIATE = 'INTERMEDIATE', 
  EXPERT = 'EXPERT'
}

export interface Judge {
  id?: number;
  name: string;
  email: string;
  phone: string;
  experienceLevel: ExperienceLevel;
  fieldSpecialization: string;
  profilePictureUrl?: string;
}

export const ExperienceLevelLabels = {
  [ExperienceLevel.NOVICE]: '0 - 1 years',
  [ExperienceLevel.INTERMEDIATE]: '1 - 5 years',
  [ExperienceLevel.EXPERT]: '5+ years'
}; 