
export interface Education {
  id?: string;
  user_id: string;
  school: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
}

export interface Experience {
  id?: string;
  user_id: string;
  company: string;
  position: string;
  location?: string;
  is_current?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
}

export interface Skill {
  id?: string;
  user_id: string;
  name: string;
  level?: string;
}

export interface CandidateProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  address: string | null;
  date_of_birth: string | null;
  created_at: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  industry: string | null;
  location: string | null;
  description: string | null;
}
