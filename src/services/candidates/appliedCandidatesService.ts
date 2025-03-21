
import { supabase } from '@/integrations/supabase/client';
import { CandidateWithStatus } from '@/types/candidate';
import { ApplicationRecord } from '@/types/candidateManagement';

export const fetchAppliedCandidates = async (userId: string) => {
  try {
    // First, find the companies associated with this employer
    const { data: companies } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userId);
    
    if (!companies || companies.length === 0) return [];
    
    const companyIds = companies.map(company => company.id);
    
    // Get jobs from this company
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id')
      .in('company_id', companyIds);
    
    if (!jobs || jobs.length === 0) return [];
    
    const jobIds = jobs.map(job => job.id);
    
    // Get applications for these jobs
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles:profiles(
          id,
          full_name,
          avatar_url,
          phone,
          bio,
          address,
          date_of_birth,
          resume_url,
          portfolio_url,
          video_intro_url,
          created_at,
          skills(id, name),
          experience(id, position, company, start_date, end_date),
          education(id, institution, degree, field_of_study, start_date, end_date)
        )
      `)
      .in('job_id', jobIds);
    
    if (error) throw error;
    
    // Extract unique profiles from applications and add email and status
    const uniqueProfiles = new Map<string, CandidateWithStatus>();
    
    applications?.forEach(app => {
      if (app.profiles) {
        const profile = app.profiles as any;
        
        // Default to empty arrays for collections
        const skills = Array.isArray(profile.skills) ? profile.skills : [];
        const experience = Array.isArray(profile.experience) ? profile.experience : [];
        const education = Array.isArray(profile.education) ? profile.education : [];
        
        const enrichedProfile: CandidateWithStatus = {
          id: profile.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          bio: profile.bio,
          address: profile.address,
          date_of_birth: profile.date_of_birth,
          resume_url: profile.resume_url,
          portfolio_url: profile.portfolio_url,
          video_intro_url: profile.video_intro_url,
          created_at: profile.created_at,
          email: app.email || `${profile.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          status: app.status || 'pending',
          skills,
          experience,
          education
        };
        
        uniqueProfiles.set(profile.id, enrichedProfile);
      }
    });
    
    return Array.from(uniqueProfiles.values());
  } catch (error) {
    console.error('Error fetching applied candidates:', error);
    throw error;
  }
};
