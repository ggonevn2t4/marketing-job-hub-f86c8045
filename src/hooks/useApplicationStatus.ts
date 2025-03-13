
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useApplicationStatus = (applicationId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('pending');

  // Fetch application status if applicationId is provided
  const fetchStatus = async () => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('status')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      
      if (data) {
        setStatus(data.status || 'pending');
      }
    } catch (error: any) {
      console.error('Error fetching application status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: string,
    candidateId: string
  ) => {
    try {
      setIsLoading(true);

      // Update status in database
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;
      
      // Send notification to candidate
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
              applicationId,
              status: newStatus,
              candidateId,
            },
          }),
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }

      toast({
        title: 'Cập nhật thành công',
        description: 'Trạng thái đơn ứng tuyển đã được cập nhật',
      });

      // Update local state
      if (applicationId === applicationId) {
        setStatus(newStatus);
      }

      return true;
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật trạng thái',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchStatus when the component mounts or applicationId changes
  useState(() => {
    fetchStatus();
  });

  return { updateApplicationStatus, isLoading, status };
};

export default useApplicationStatus;
