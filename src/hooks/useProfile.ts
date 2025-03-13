import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchCandidateProfile,
  updateCandidateBasicInfo,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  updateSkill,
  deleteSkill,
  uploadResume,
  deleteResume
} from '@/services/profileService';
import type { CandidateProfile, Education, Experience, Skill } from '@/types/profile';

export const useProfile = () => {
  const { user, userRole } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchCandidateProfile(user.id);
        setProfile(data);
      } catch (error: any) {
        toast({
          title: 'Lỗi khi tải hồ sơ',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  const updateBasicInfo = async (data: Partial<CandidateProfile>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await updateCandidateBasicInfo(user.id, data);
      
      // Cập nhật state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin cơ bản đã được cập nhật',
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

  const handleAddEducation = async (data: Omit<Education, 'user_id'>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const newEducation = await addEducation({
        ...data,
        user_id: user.id
      });
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          education: [newEducation, ...prev.education]
        };
      });
      
      toast({
        title: 'Thêm thành công',
        description: 'Thông tin học vấn đã được thêm',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi thêm',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEducation = async (id: string, data: Partial<Education>) => {
    try {
      setIsLoading(true);
      await updateEducation(id, data);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          education: prev.education.map(item => 
            item.id === id ? { ...item, ...data } : item
          )
        };
      });
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin học vấn đã được cập nhật',
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

  const handleDeleteEducation = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteEducation(id);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          education: prev.education.filter(item => item.id !== id)
        };
      });
      
      toast({
        title: 'Xóa thành công',
        description: 'Thông tin học vấn đã được xóa',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi xóa',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExperience = async (data: Omit<Experience, 'user_id'>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const newExperience = await addExperience({
        ...data,
        user_id: user.id
      });
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          experience: [newExperience, ...prev.experience]
        };
      });
      
      toast({
        title: 'Thêm thành công',
        description: 'Thông tin kinh nghiệm đã được thêm',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi thêm',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExperience = async (id: string, data: Partial<Experience>) => {
    try {
      setIsLoading(true);
      await updateExperience(id, data);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          experience: prev.experience.map(item => 
            item.id === id ? { ...item, ...data } : item
          )
        };
      });
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Thông tin kinh nghiệm đã được cập nhật',
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

  const handleDeleteExperience = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteExperience(id);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          experience: prev.experience.filter(item => item.id !== id)
        };
      });
      
      toast({
        title: 'Xóa thành công',
        description: 'Thông tin kinh nghiệm đã được xóa',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi xóa',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (data: Omit<Skill, 'user_id'>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const newSkill = await addSkill({
        ...data,
        user_id: user.id
      });
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          skills: [...prev.skills, newSkill]
        };
      });
      
      toast({
        title: 'Thêm thành công',
        description: 'Kỹ năng đã được thêm',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi thêm',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSkill = async (id: string, data: Partial<Skill>) => {
    try {
      setIsLoading(true);
      await updateSkill(id, data);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          skills: prev.skills.map(item => 
            item.id === id ? { ...item, ...data } : item
          )
        };
      });
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Kỹ năng đã được cập nhật',
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

  const handleDeleteSkill = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteSkill(id);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          skills: prev.skills.filter(item => item.id !== id)
        };
      });
      
      toast({
        title: 'Xóa thành công',
        description: 'Kỹ năng đã được xóa',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi xóa',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadResume = async (file: File) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const resumeUrl = await uploadResume(user.id, file);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          resume_url: resumeUrl
        };
      });
      
      toast({
        title: 'Tải lên thành công',
        description: 'CV của bạn đã được tải lên',
      });
      
      return resumeUrl;
    } catch (error: any) {
      toast({
        title: 'Lỗi khi tải lên CV',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await deleteResume(user.id);
      
      // Cập nhật state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          resume_url: null
        };
      });
      
      toast({
        title: 'Xóa thành công',
        description: 'CV của bạn đã được xóa',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi xóa CV',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    updateBasicInfo,
    handleAddEducation,
    handleUpdateEducation,
    handleDeleteEducation,
    handleAddExperience,
    handleUpdateExperience,
    handleDeleteExperience,
    handleAddSkill,
    handleUpdateSkill,
    handleDeleteSkill,
    handleUploadResume,
    handleDeleteResume
  };
};
