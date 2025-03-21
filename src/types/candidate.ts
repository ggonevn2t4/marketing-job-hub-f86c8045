
import { CandidateProfile } from './profile';

// Define a candidate interface that extends CandidateProfile with email and status
export interface CandidateWithStatus {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  address: string | null;
  date_of_birth: string | null;
  resume_url: string | null;
  portfolio_url: string | null;
  video_intro_url: string | null;
  created_at: string;
  email?: string;
  status?: string;
  skills?: any[];
  experience?: any[];
  education?: any[];
}

export interface CandidateFilters {
  searchTerm?: string;
  skillName?: string;
  location?: string;
  experienceYears?: string;
}
