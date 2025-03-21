
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
    
    // Get applications for these jobs without trying to join profiles
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('id, email, status, job_id')
      .in('job_id', jobIds);
    
    if (error) throw error;
    if (!applications || applications.length === 0) return [];
    
    // Process each application separately to build candidates array
    const candidates: CandidateWithStatus[] = [];
    
    for (const application of applications) {
      // We don't have profile IDs directly, so we'll need to work with what we have
      // For each application, try to find a profile with matching email
      if (!application.email) continue;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', application.email.split('@')[0])
        .maybeSingle();
      
      if (profileError || !profile) {
        // Create a minimal candidate with just email and status
        candidates.push({
          id: application.id, // Using application ID as fallback
          full_name: application.email.split('@')[0] || 'Unknown',
          email: application.email,
          status: application.status || 'pending',
          avatar_url: null,
          phone: null,
          bio: null,
          address: null,
          date_of_birth: null,
          resume_url: null,
          portfolio_url: null,
          video_intro_url: null,
          created_at: new Date().toISOString(),
          skills: [],
          experience: [],
          education: []
        });
        continue;
      }
      
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
        email: application.email,
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
