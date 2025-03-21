
import { supabase } from '@/integrations/supabase/client';
import { CandidateWithStatus } from '@/types/candidate';
import { SavedCandidateRecord } from '@/types/candidateManagement';

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
