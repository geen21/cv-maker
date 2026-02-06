export interface CVData {
  firstName: string;
  lastName: string;
  titles: string[];
  email: string;
  linkedin: string;
  phone: string;
  birthDate: string;
  location: string;
  certifications: string[];
  drivingLicense: boolean;
  photoUrl?: string;
  extraLogos?: string[];

  experiences: Experience[];
  previousExperiencesSummary?: PreviousExperiencesSummary;

  competences: CompetenceCategory[];

  references: Reference[];
  projects?: Project[];
  education: Education[];
}

export interface Experience {
  dateRange: string;
  company: string;
  location: string;
  roles: Role[];
}

export interface Role {
  title: string;
  bullets: string[];
}

export interface PreviousExperiencesSummary {
  title: string;
  bullets: string[];
}

export interface CompetenceCategory {
  icon: string;
  title: string;
  subcategories?: CompetenceSubcategory[];
  items?: string[];
}

export interface CompetenceSubcategory {
  title: string;
  items: string[];
}

export interface Reference {
  name: string;
  email?: string;
  title: string;
}

export interface Project {
  year: string;
  sector: string;
  description: string;
}

export interface Education {
  dateRange: string;
  institution: string;
  degree: string;
  details?: string[];
}
