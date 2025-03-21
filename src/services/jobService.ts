import { supabase } from '@/integrations/supabase/client';
import { matchJobWithCandidates } from '@/utils/jobMatcher';
import type { JobPosting } from '@/types/job';

export const createJobPosting = async (jobData: any) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select('id')
      .single();
    
    if (error) throw error;
    
    // Match job with candidates for notifications
    if (data?.id && jobData.requirements) {
      await matchJobWithCandidates(data.id, jobData.requirements);
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating job posting:', error);
    throw new Error(error.message || 'Failed to create job posting');
  }
};

export const getCompanyIdForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.id;
  } catch (error) {
    console.error('Error getting company ID:', error);
    return null;
  }
};

export const fetchJobCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job categories:', error);
    return [];
  }
};
