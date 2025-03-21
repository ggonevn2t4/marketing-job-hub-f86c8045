
import { supabase } from '@/integrations/supabase/client';
import { CandidateWithStatus } from '@/types/candidate';

export const fetchAllCandidates = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        skills(*),
        experience(*),
        education(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Process data with type safety
    const candidatesWithEmail = (data || []).map(candidate => {
      // Handle potential null or undefined skills, experience, education
      const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
      const experience = Array.isArray(candidate.experience) ? candidate.experience : [];
      const education = Array.isArray(candidate.education) ? candidate.education : [];
      
      // Create a properly typed candidate object
      const typedCandidate: CandidateWithStatus = {
        id: candidate.id,
        full_name: candidate.full_name,
        avatar_url: candidate.avatar_url,
        phone: candidate.phone,
        bio: candidate.bio,
        address: candidate.address,
        date_of_birth: candidate.date_of_birth,
        resume_url: candidate.resume_url,
        portfolio_url: candidate.portfolio_url,
        video_intro_url: candidate.video_intro_url, // Fixed property name
        created_at: candidate.created_at,
        email: `${candidate.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        status: 'active',
        skills,
        experience,
        education
      };
      
      return typedCandidate;
    });
    
    return candidatesWithEmail;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const fetchSavedCandidates = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_candidates')
      .select(`
        *,
        candidate:candidate_id(
          *,
          skills(*),
          experience(*),
          education(*)
        )
      `)
      .eq('employer_id', userId);
    
    if (error) throw error;
    
    // Process candidate data and add email and status
    const candidates = (data || []).map(item => {
      if (!item.candidate) return null;
      const candidate = item.candidate as any;
      
      // Handle potential null or undefined arrays
      const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
      const experience = Array.isArray(candidate.experience) ? candidate.experience : [];
      const education = Array.isArray(candidate.education) ? candidate.education : [];
      
      // Create a properly typed candidate object
      const typedCandidate: CandidateWithStatus = {
        id: candidate.id,
        full_name: candidate.full_name,
        avatar_url: candidate.avatar_url,
        phone: candidate.phone,
        bio: candidate.bio,
        address: candidate.address,
        date_of_birth: candidate.date_of_birth,
        resume_url: candidate.resume_url,
        portfolio_url: candidate.portfolio_url,
        video_intro_url: candidate.video_intro_url,
        created_at: candidate.created_at,
        email: `${candidate.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        status: 'saved',
        skills,
        experience,
        education
      };
      
      return typedCandidate;
    }).filter(Boolean) as CandidateWithStatus[];
    
    return candidates;
  } catch (error) {
    console.error('Error fetching saved candidates:', error);
    throw error;
  }
};

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
          *,
          skills(*),
          experience(*),
          education(*)
        )
      `)
      .in('job_id', jobIds);
    
    if (error) throw error;
    
    // Extract unique profiles from applications and add email and status
    const uniqueProfiles = new Map<string, CandidateWithStatus>();
    
    applications?.forEach(app => {
      if (app.profiles) {
        const profile = app.profiles as any;
        
        // Handle potential null or undefined arrays
        const skills = Array.isArray(profile.skills) ? profile.skills : [];
        const experience = Array.isArray(profile.experience) ? profile.experience : [];
        const education = Array.isArray(profile.education) ? profile.education : [];
        
        // Use an explicitly typed CandidateWithStatus object to avoid deep type instantiation
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
          skills: skills as any[],
          experience: experience as any[],
          education: education as any[]
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

export const updateCandidateStatusService = async (candidateId: string, status: string) => {
  try {
    // In a real application, we might update a join table or application status
    // For this example, we just return a resolved promise
    
    // Notify the candidate about the status change
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'application_update',
          data: {
            applicationId: candidateId, // Using candidate ID for simplicity
            status,
            candidateId,
          },
        }),
      });
    } catch (error) {
      console.error('Error sending status update notification:', error);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error updating candidate status:', error);
    return Promise.reject(error);
  }
};
