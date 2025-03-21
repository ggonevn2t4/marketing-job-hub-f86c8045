
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CandidateProfile } from '@/types/profile';

// Define a candidate interface that extends CandidateProfile with email and status
export interface CandidateWithStatus extends CandidateProfile {
  email?: string;
  status?: string;
}

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
      fetchAllCandidates();
      fetchSavedCandidates();
      fetchAppliedCandidates();
    }
  }, [user, userRole]);
  
  const fetchAllCandidates = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would be filtered by various criteria
      // Here we're just getting all profiles with type 'candidate'
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

      // Fetch user emails from auth.users via a service function or stored in profiles
      // This is a simplified approach, in a real app you might store email in profiles directly
      const candidatesWithEmail = await Promise.all((data || []).map(async (candidate) => {
        // We would normally get this from auth.users, but for this example we'll just set a dummy email
        return {
          ...candidate,
          email: `${candidate.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          status: 'active' // Default status
        } as CandidateWithStatus;
      }));
      
      setAllCandidates(candidatesWithEmail);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách ứng viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSavedCandidates = async () => {
    if (!user) return;
    
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
        .eq('employer_id', user.id);
      
      if (error) throw error;
      
      // Process candidate data and add email and status
      const candidates = (data || []).map(item => {
        if (!item.candidate) return null;
        const candidate = item.candidate as any;
        return {
          ...candidate,
          email: `${candidate.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          status: 'saved' // Default status for saved candidates
        } as CandidateWithStatus;
      }).filter(Boolean) as CandidateWithStatus[];
      
      setSavedCandidates(candidates);
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
    }
  };
  
  const fetchAppliedCandidates = async () => {
    if (!user) return;
    
    try {
      // First, find the companies associated with this employer
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id);
      
      if (!companies || companies.length === 0) return;
      
      const companyIds = companies.map(company => company.id);
      
      // Get jobs from this company
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .in('company_id', companyIds);
      
      if (!jobs || jobs.length === 0) return;
      
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
          
          // Add email and application status
          const enrichedProfile: CandidateWithStatus = {
            ...profile,
            email: app.email || `${profile.full_name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            status: app.status || 'pending'
          };
          
          uniqueProfiles.set(profile.id, enrichedProfile);
        }
      });
      
      setAppliedCandidates(Array.from(uniqueProfiles.values()));
    } catch (error) {
      console.error('Error fetching applied candidates:', error);
    }
  };
  
  const updateCandidateStatus = async (candidateId: string, status: string) => {
    try {
      // In a real application, we might update a join table or application status
      // For this example, we'll update the local state only
      
      setAllCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
      setSavedCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
      setAppliedCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
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
  
  const filterCandidates = (candidates: CandidateWithStatus[]) => {
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
        (candidate.experience && candidate.experience.length >= parseInt(filterExperience));
      
      return matchesSearch && matchesSkill && matchesLocation && matchesExperience;
    });
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
    filterCandidates
  };
};
