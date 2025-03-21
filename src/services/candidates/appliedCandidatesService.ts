
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
    
    // Get applications for these jobs - replacing the problematic query
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select(`
        id, email, status, job_id,
        profiles:profiles(
          id, full_name, avatar_url, phone, bio, address, date_of_birth, 
          resume_url, portfolio_url, video_intro_url, created_at
        )
      `)
      .in('job_id', jobIds);
    
    if (error) throw error;
    
    // Fetch skills, experience, and education separately to avoid deep nesting
    const candidates: CandidateWithStatus[] = [];
    
    for (const app of applications || []) {
      if (!app.profiles) continue;
      
      const profile = app.profiles as any;
      
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
        skills: skills || [],
        experience: experience || [],
        education: education || []
      };
      
      // Check if we already have this candidate
      const existingIndex = candidates.findIndex(c => c.id === profile.id);
      if (existingIndex === -1) {
        candidates.push(enrichedProfile);
      }
    }
    
    return candidates;
  } catch (error) {
    console.error('Error fetching applied candidates:', error);
    throw error;
  }
};
