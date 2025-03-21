
import { CandidateWithStatus } from './candidate';

export interface SavedCandidateRecord {
  id: string;
  employer_id: string;
  candidate_id: string;
  candidate?: any;
  created_at?: string;
}

export interface ApplicationRecord {
  id: string;
  job_id: string;
  status: string;
  email?: string;
  profiles?: any;
}
