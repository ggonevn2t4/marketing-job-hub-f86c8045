
export interface JobPosting {
  title: string;
  company_id: string;
  category_id: string;
  job_type: string;
  experience_level: string;
  location: string;
  salary?: string | null;
  description?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  is_featured?: boolean;
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobFormData {
  title: string;
  category_id: string;
  job_type: string;
  experience_level: string;
  location: string;
  salary_min?: string;
  salary_max?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  company: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    description?: string;
  };
}

export const JOB_TYPES = [
  { value: 'full-time', label: 'Toàn thời gian' },
  { value: 'part-time', label: 'Bán thời gian' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'remote', label: 'Remote' },
  { value: 'internship', label: 'Thực tập' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0-1 năm)' },
  { value: 'junior', label: 'Junior (1-2 năm)' },
  { value: 'middle', label: 'Middle (2-5 năm)' },
  { value: 'senior', label: 'Senior (5+ năm)' },
  { value: 'manager', label: 'Manager (7+ năm)' },
];
