
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useBookmarkJob = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const fetchSavedJobs = async () => {
    if (!user) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const jobIds = data.map(item => item.job_id);
      setSavedJobs(jobIds);
      return jobIds;
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để lưu việc làm này',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: 'Thông báo',
            description: 'Bạn đã lưu việc làm này rồi',
          });
          return true;
        }
        throw error;
      }

      setSavedJobs(prev => [...prev, jobId]);
      toast({
        title: 'Thành công',
        description: 'Đã lưu việc làm vào danh sách yêu thích',
      });
      return true;
    } catch (error: any) {
      console.error('Error saving job:', error.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu việc làm này',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (jobId: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;

      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast({
        title: 'Thành công',
        description: 'Đã xóa việc làm khỏi danh sách yêu thích',
      });
      return true;
    } catch (error: any) {
      console.error('Error removing saved job:', error.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa việc làm này khỏi danh sách',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };

  return {
    loading,
    savedJobs,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    isJobSaved,
  };
};

export default useBookmarkJob;
