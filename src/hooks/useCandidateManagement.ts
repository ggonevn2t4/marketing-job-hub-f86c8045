
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CandidateWithStatus } from '@/types/candidate';
import { 
  fetchAllCandidates, 
  fetchSavedCandidates, 
  fetchAppliedCandidates,
  updateCandidateStatusService
} from '@/services/candidateManagementService';
import { filterCandidates } from '@/utils/candidateFilters';

// Re-export the CandidateWithStatus type for backward compatibility
export type { CandidateWithStatus };

export const useCandidateManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  
  const [allCandidates, setAllCandidates] = useState<CandidateWithStatus[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<CandidateWithStatus[]>([]);
  const [appliedCandidates, setAppliedCandidates] = useState<CandidateWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If user is not employer, redirect to home
    if (userRole !== 'employer' && !isLoading) {
      navigate('/');
      return;
    }
    
    if (user) {
      loadAllCandidates();
      loadSavedCandidates();
      loadAppliedCandidates();
    }
  }, [user, userRole]);
  
  const loadAllCandidates = async () => {
    try {
      setIsLoading(true);
      const candidates = await fetchAllCandidates();
      setAllCandidates(candidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách ứng viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSavedCandidates = async () => {
    if (!user) return;
    
    try {
      const candidates = await fetchSavedCandidates(user.id);
      setSavedCandidates(candidates);
    } catch (error) {
      console.error('Error loading saved candidates:', error);
    }
  };
  
  const loadAppliedCandidates = async () => {
    if (!user) return;
    
    try {
      const candidates = await fetchAppliedCandidates(user.id);
      setAppliedCandidates(candidates);
    } catch (error) {
      console.error('Error loading applied candidates:', error);
    }
  };
  
  const updateCandidateStatus = async (candidateId: string, status: string) => {
    try {
      await updateCandidateStatusService(candidateId, status);
      
      // Update the local state for all three candidate lists
      const updateCandidateInList = (list: CandidateWithStatus[]) => 
        list.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        );
      
      setAllCandidates(prev => updateCandidateInList(prev));
      setSavedCandidates(prev => updateCandidateInList(prev));
      setAppliedCandidates(prev => updateCandidateInList(prev));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating candidate status:', error);
      return Promise.reject(error);
    }
  };
  
  const filterCandidatesList = (candidates: CandidateWithStatus[]) => {
    return filterCandidates(
      candidates,
      searchTerm,
      filterSkill,
      filterLocation,
      filterExperience
    );
  };

  return {
    allCandidates,
    savedCandidates,
    appliedCandidates,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterSkill,
    setFilterSkill,
    filterLocation,
    setFilterLocation,
    filterExperience,
    setFilterExperience,
    updateCandidateStatus,
    filterCandidates: filterCandidatesList
  };
};
