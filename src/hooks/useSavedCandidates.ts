
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  saveCandidate,
  unsaveCandidate,
  isCandidateSaved,
  fetchSavedCandidates
} from '@/services/candidateService';

export const useSavedCandidates = () => {
  const { user } = useAuth();
  const [savedCandidates, setSavedCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedCandidates();
    }
  }, [user]);

  const loadSavedCandidates = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await fetchSavedCandidates();
      setSavedCandidates(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi khi tải ứng viên đã lưu',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCandidate = async (candidateId: string, notes?: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await saveCandidate(candidateId, notes);
      
      toast({
        title: 'Đã lưu ứng viên',
        description: 'Ứng viên đã được thêm vào danh sách đã lưu',
      });
      
      await loadSavedCandidates();
    } catch (error: any) {
      toast({
        title: 'Lỗi khi lưu ứng viên',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsaveCandidate = async (candidateId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await unsaveCandidate(candidateId);
      
      toast({
        title: 'Đã bỏ lưu ứng viên',
        description: 'Ứng viên đã được xóa khỏi danh sách đã lưu',
      });
      
      setSavedCandidates(prev => prev.filter(item => item.candidate_id !== candidateId));
    } catch (error: any) {
      toast({
        title: 'Lỗi khi bỏ lưu ứng viên',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsCandidateSaved = async (candidateId: string) => {
    if (!user) return false;
    
    try {
      return await isCandidateSaved(candidateId);
    } catch (error) {
      console.error('Error checking if candidate is saved:', error);
      return false;
    }
  };

  return {
    savedCandidates,
    isLoading,
    saveCandidate: handleSaveCandidate,
    unsaveCandidate: handleUnsaveCandidate,
    isCandidateSaved: checkIsCandidateSaved,
    refreshSavedCandidates: loadSavedCandidates
  };
};
