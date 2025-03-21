
import { CandidateWithStatus } from '@/types/candidate';

export const filterCandidates = (
  candidates: CandidateWithStatus[],
  searchTerm: string,
  filterSkill: string,
  filterLocation: string,
  filterExperience: string
) => {
  return candidates.filter(candidate => {
    // Search term filtering
    const matchesSearch = !searchTerm || 
      (candidate.full_name && candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (candidate.bio && candidate.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Skills filtering
    const matchesSkill = !filterSkill || 
      (candidate.skills && candidate.skills.some(skill => 
        skill.name.toLowerCase().includes(filterSkill.toLowerCase())
      ));
    
    // Location filtering
    const matchesLocation = !filterLocation || 
      (candidate.address && candidate.address.toLowerCase().includes(filterLocation.toLowerCase()));
    
    // Experience filtering
    const matchesExperience = !filterExperience || 
      (candidate.experience && candidate.experience.length >= parseInt(filterExperience || '0'));
    
    return matchesSearch && matchesSkill && matchesLocation && matchesExperience;
  });
};
