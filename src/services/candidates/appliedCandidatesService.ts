
import { supabase } from '@/integrations/supabase/client';
import { CandidateWithStatus } from '@/types/candidate';
import { ApplicationRecord } from '@/types/candidateManagement';

export const fetchAppliedCandidates = async (userId: string) => {
  try {
    // First, find the companies associated with this employer
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', userId);
    
    if (companiesError) throw companiesError;
    if (!companies || companies.length === 0) return [];
    
    const companyIds = companies.map(company => company.id);
    
    // Get jobs from this company
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .in('company_id', companyIds);
    
    if (jobsError) throw jobsError;
    if (!jobs || jobs.length === 0) return [];
    
    const jobIds = jobs.map(job => job.id);
    
    // Get applications for these jobs - using simpler query to avoid type depth issues
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('id, email, status, job_id, profile_id:profiles(id)')
      .in('job_id', jobIds);
    
    if (error) throw error;
    if (!applications || applications.length === 0) return [];
    
    // Get profile IDs from applications
    const profileIds = applications
      .map(app => app.profile_id?.id)
      .filter(Boolean) as string[];
    
    if (profileIds.length === 0) return [];
    
    // Fetch profiles separately with a simpler query
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', profileIds);
    
    if (profilesError) throw profilesError;
    if (!profiles) return [];
    
    // Construct candidates array with profile data
    const candidates: CandidateWithStatus[] = [];
    
    for (const profile of profiles) {
      // Find the corresponding application
      const application = applications.find(
        app => app.profile_id?.id === profile.id
      );
      
      if (!application) continue;
      
      // Fetch skills for this profile
      const { data: skills } = await supabase
        .from('skills')
        .select('id, name')
        .eq('user_id', profile.id);
      
      // Fetch experience for this profile
      const { data: experience } = await supabase
        .from('experience')
        .select('id, position, company, start_date, end_date')
        .eq('user_id', profile.id);
      
      // Fetch education for this profile
      const { data: education } = await supabase
        .from('education')
        .select('id, institution, degree, field_of_study, start_date, end_date')
        .eq('user_id', profile.id);
      
      // Create the candidate object with all data
      const candidate: CandidateWithStatus = {
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
        email: application.email || `${profile.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        status: application.status || 'pending',
        skills: skills || [],
        experience: experience || [],
        education: education || []
      };
      
      candidates.push(candidate);
    }
    
    return candidates;
  } catch (error) {
    console.error('Error fetching applied candidates:', error);
    throw error;
  }
};
