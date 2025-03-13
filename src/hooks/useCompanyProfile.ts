
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchCompanyProfile, updateCompanyProfile } from '@/services/profileService';
import type { CompanyProfile } from '@/types/profile';

export const useCompanyProfile = (companyId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (!companyId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchCompanyProfile(companyId);
        setProfile(data);
      } catch (error: any) {
        toast({
          title: 'Lỗi khi tải hồ sơ công ty',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [companyId, toast]);

  const updateProfile = async (data: Partial<CompanyProfile>) => {
    if (!companyId) return;
    
    try {
      setIsLoading(true);
      await updateCompanyProfile(companyId, data);
      
      // Cập nhật state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin công ty đã được cập nhật',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi cập nhật',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    updateProfile
  };
};
