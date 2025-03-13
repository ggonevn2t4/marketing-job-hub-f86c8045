
import { supabase } from '@/integrations/supabase/client';

export const matchJobWithCandidates = async (jobId: string, requirements: string) => {
  if (!requirements) return;
  
  try {
    // Get all candidates with skills
    const { data: candidateSkills } = await supabase
      .from('skills')
      .select('user_id, name');
    
    if (!candidateSkills || candidateSkills.length === 0) return;
    
    // Group skills by user
    const candidateSkillMap = candidateSkills.reduce((acc, curr) => {
      if (!acc[curr.user_id]) {
        acc[curr.user_id] = [];
      }
      acc[curr.user_id].push(curr.name.toLowerCase());
      return acc;
    }, {} as Record<string, string[]>);
    
    const requirementsLower = requirements.toLowerCase();
    const matchingCandidates: string[] = [];
    
    // Find candidates with matching skills
    Object.entries(candidateSkillMap).forEach(([userId, skills]) => {
      for (const skill of skills) {
        if (requirementsLower.includes(skill)) {
          matchingCandidates.push(userId);
          break;
        }
      }
    });
    
    // Send match notifications
    for (const candidateId of matchingCandidates) {
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'job_match',
            data: {
              jobId,
              candidateId,
            },
          }),
        });
      } catch (error) {
        console.error('Error sending job match notification:', error);
      }
    }
  } catch (error) {
    console.error('Error matching job with candidates:', error);
  }
};

export default matchJobWithCandidates;
