
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
        video_intro_url: candidate.video_intro_url,
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
