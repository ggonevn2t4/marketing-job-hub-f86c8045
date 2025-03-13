
import { supabase } from '@/integrations/supabase/client';
import type { JobPosting } from '@/types/job';
import { format } from 'date-fns';

export interface ManagedJob extends JobPosting {
  id: string;
  applications_count: number;
  created_at: string;
  expires_at?: string;
}

// Fetch jobs posted by the employer
export const fetchEmployerJobs = async (employerId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications_count:job_applications(count)
      `)
      .eq('company_id', employerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(job => ({
      ...job,
      applications_count: job.applications_count[0].count,
      created_at: format(new Date(job.created_at), 'dd/MM/yyyy'),
      // Assuming job postings expire after 30 days - this would be replaced by actual expiry date from DB
      expires_at: format(new Date(new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy')
    })) as ManagedJob[];
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    return [];
  }
};

// Delete a job posting
export const deleteJobPosting = async (jobId: string) => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting job posting:', error);
    throw error;
  }
};

// Renew a job posting (update expiry date by extending it)
export const renewJobPosting = async (jobId: string) => {
  try {
    // In a real implementation, this would update the expiry date in the database
    // For now, we'll just return success
    return true;
  } catch (error) {
    console.error('Error renewing job posting:', error);
    throw error;
  }
};
